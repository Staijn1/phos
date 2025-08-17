using System.Text.Json;
using Phos.Orchestrator.Core;
using Phos.Orchestrator.Core.Contracts;

namespace Phos.Orchestrator.Api.Services;

/// <summary>
/// Simple in-memory registry keyed by DeviceId (MAC). Includes basic state transitions
/// and a SaveSnapshot hook. Suitable as a starting point; replace with durable storage later.
/// </summary>
public sealed class InMemoryRegistry : IDeviceRegistry
{
  private readonly object _lock = new();
  private readonly object _saveLock = new();
  private readonly Dictionary<string, (DeviceSnapshot snap, int misses)> _map = new();
  private readonly string _snapshotPath;

  private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web)
  {
    WriteIndented = false
  };

  public InMemoryRegistry(IHostEnvironment env)
  {
    var dir = Path.Combine(env.ContentRootPath, "data");
    Directory.CreateDirectory(dir);
    _snapshotPath = Path.Combine(dir, "devices.json");

    foreach (var f in Directory.EnumerateFiles(dir, "devices.json.*.tmp"))
    {
      try { File.Delete(f); } catch { /* ignore */ }
    }
  }


  /// <summary>Return a copy-on-read list of device snapshots.</summary>
  public IReadOnlyList<DeviceSnapshot> All()
  {
    lock (_lock)
    {
      return _map.Values.Select(v => v.snap).ToList();
    }
  }

  /// <summary>Return a device snapshot by id or null.</summary>
  public DeviceSnapshot? Get(string id)
  {
    lock (_lock)
    {
      return _map.TryGetValue(id, out var v) ? v.snap : null;
    }
  }

  /// <summary>
  /// Upsert device and reset miss counters. Sets state to Online and updates LastSeen.
  /// </summary>
  public void Upsert(DeviceSnapshot s)
  {
    lock (_lock)
    {
      _map[s.DeviceId] = (s with { LastSeen = DateTimeOffset.UtcNow, State = DeviceOnlineState.Online }, 0);
    }

    SaveSnapshot();
  }

  /// <summary>Mark a device as Suspect. No-op if unknown.</summary>
  public void MarkSuspect(string id) => UpdateState(id, DeviceOnlineState.Suspect);

  /// <summary>Mark a device as Offline. No-op if unknown.</summary>
  public void MarkOffline(string id) => UpdateState(id, DeviceOnlineState.Offline);

  /// <summary>Update last known IP/port without touching other fields.</summary>
  public void SetIp(string id, string ip, int port)
  {
    lock (_lock)
    {
      if (_map.TryGetValue(id, out var v))
      {
        _map[id] = (v.snap with { Ip = ip, Port = port }, v.misses);
      }
    }
  }

  /// <summary>
  /// Persist the registry to disk atomically.
  /// Implement with temp-file + move to avoid partial writes.
  /// </summary>
  public void SaveSnapshot()
  {
    // 1) Take an in-memory copy under the map lock
    List<DeviceSnapshot> data;
    lock (_lock) data = _map.Values.Select(v => v.snap).ToList();

    // 2) Serialize to a unique temp, then atomically move/replace
    lock (_saveLock) // serialize file IO across threads
    {
      var dir = Path.GetDirectoryName(_snapshotPath)!;
      Directory.CreateDirectory(dir);

      var tmp = _snapshotPath + "." + Guid.NewGuid().ToString("N") + ".tmp";
      var bak = _snapshotPath + ".bak";

      using (var fs = new FileStream(
               tmp, FileMode.CreateNew, FileAccess.Write, FileShare.None,
               bufferSize: 64 * 1024, FileOptions.WriteThrough))
      {
        JsonSerializer.Serialize(fs, data, Json);
        fs.Flush(true);
      }

      try
      {
        if (OperatingSystem.IsWindows())
        {
          if (File.Exists(_snapshotPath))
            File.Replace(tmp, _snapshotPath, bak, ignoreMetadataErrors: true);
          else
            File.Move(tmp, _snapshotPath, overwrite: false);
        }
        else
        {
          File.Move(tmp, _snapshotPath, overwrite: true); // POSIX atomic rename
        }
      }
      finally
      {
        if (File.Exists(tmp)) File.Delete(tmp);
      }
    }
  }


  private void UpdateState(string id, DeviceOnlineState st)
  {
    lock (_lock)
    {
      if (_map.TryGetValue(id, out var v))
      {
        _map[id] = (v.snap with { State = st }, v.misses);
      }
    }
  }
}

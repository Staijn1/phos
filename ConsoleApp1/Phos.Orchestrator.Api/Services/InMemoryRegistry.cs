using System.Text.Json;
using Phos.Orchestrator.Core;
using Phos.Orchestrator.Core.Contracts;

namespace Phos.Orchestrator.Api.Services;

/// <summary>
/// In-memory device registry with state machine (Online → Suspect → Offline) and atomic snapshots.
/// </summary>
public sealed class InMemoryRegistry : IDeviceRegistry
{
  // Thresholds: after K misses -> Suspect, after M misses -> Offline.
  private const int MissesToSuspect = 2;
  private const int MissesToOffline = 6;

  private readonly object _mapLock = new();
  private readonly object _saveLock = new();

  private readonly Dictionary<string, (DeviceSnapshot snapshot, int misses)> _deviceMap = new();
  private readonly string _snapshotPath;

  private readonly IDeviceEventBus _eventBus;
  private readonly ILogger<InMemoryRegistry> _logger;

  private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
  {
    WriteIndented = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"
  };

  public InMemoryRegistry(IHostEnvironment hostEnvironment, IDeviceEventBus eventBus, ILogger<InMemoryRegistry> logger)
  {
    _eventBus = eventBus;
    _logger = logger;

    string directory = Path.Combine(hostEnvironment.ContentRootPath, "data");
    Directory.CreateDirectory(directory);
    _snapshotPath = Path.Combine(directory, "devices.json");

    foreach (string tempFile in Directory.EnumerateFiles(directory, "devices.json.*.tmp"))
    {
      try { File.Delete(tempFile); } catch { /* ignore */ }
    }
  }

  public IReadOnlyList<DeviceSnapshot> All()
  {
    lock (_mapLock)
    {
      return _deviceMap.Values.Select(v => v.snapshot).ToList();
    }
  }

  public DeviceSnapshot? Get(string deviceId)
  {
    lock (_mapLock)
    {
      return _deviceMap.TryGetValue(deviceId, out var value) ? value.snapshot : null;
    }
  }

  /// <summary>
  /// Successful probe: upsert snapshot, set Online, reset misses, update LastSeen, emit Added/Updated.
  /// </summary>
  public void Upsert(DeviceSnapshot snapshot)
  {
    DeviceEventType eventType;

    lock (_mapLock)
    {
      bool isNew = !_deviceMap.ContainsKey(snapshot.DeviceId);
      eventType = isNew ? DeviceEventType.Added : DeviceEventType.Updated;

      _deviceMap[snapshot.DeviceId] =
        (snapshot with { LastSeen = DateTimeOffset.UtcNow, State = DeviceOnlineState.Online }, 0);
    }

    _eventBus.Publish(new DeviceEvent(eventType, snapshot));
    TrySaveSnapshot();
  }

  public void MarkSuspect(string deviceId)
  {
    UpdateState(deviceId, DeviceOnlineState.Suspect, emitOffline: false);
  }

  public void MarkOffline(string deviceId)
  {
    UpdateState(deviceId, DeviceOnlineState.Offline, emitOffline: true);
  }

  public void SetIp(string deviceId, string ip, int port)
  {
    lock (_mapLock)
    {
      if (_deviceMap.TryGetValue(deviceId, out var value))
      {
        _deviceMap[deviceId] = (value.snapshot with { Ip = ip, Port = port }, value.misses);
      }
    }
    TrySaveSnapshot();
  }

  /// <summary>
  /// Record a probe miss for a known device by id. Advances Online→Suspect→Offline at thresholds.
  /// </summary>
  public void NoteProbeMissById(string deviceId)
  {
    DeviceEventType? eventType = null;
    DeviceSnapshot? newSnapshot = null;

    lock (_mapLock)
    {
      if (!_deviceMap.TryGetValue(deviceId, out var value))
      {
        return;
      }

      value.misses++;
      (eventType, newSnapshot) = ApplyMissTransitions(value);
      _deviceMap[deviceId] = (newSnapshot!, value.misses);
    }

    if (eventType.HasValue && newSnapshot is not null)
    {
      _eventBus.Publish(new DeviceEvent(eventType.Value, newSnapshot));
      TrySaveSnapshot();
    }
  }

  /// <summary>
  /// Record a probe miss by IP when the deviceId is unknown to the caller.
  /// </summary>
  public void NoteProbeMissByIp(string ip)
  {
    List<(string id, DeviceSnapshot snap, int misses)> affected;

    lock (_mapLock)
    {
      affected = _deviceMap
        .Where(kv => kv.Value.snapshot.Ip == ip)
        .Select(kv => (kv.Key, kv.Value.snapshot, kv.Value.misses + 1))
        .ToList();

      foreach (var entry in affected)
      {
        var trans = ApplyMissTransitions((entry.snap, entry.misses));
        _deviceMap[entry.id] = (trans.newSnapshot!, entry.misses);
      }
    }

    foreach (var entry in affected)
    {
      var trans = ApplyMissTransitions((entry.snap, entry.misses));
      if (trans.eventType.HasValue && trans.newSnapshot is not null)
      {
        _eventBus.Publish(new DeviceEvent(trans.eventType.Value, trans.newSnapshot));
      }
    }

    if (affected.Count > 0)
    {
      TrySaveSnapshot();
    }
  }

  /// <summary>
  /// Apply state transitions based on miss count. Returns event type and updated snapshot.
  /// </summary>
  private static (DeviceEventType? eventType, DeviceSnapshot? newSnapshot) ApplyMissTransitions((DeviceSnapshot snap, int misses) entry)
  {
    var snapshot = entry.snap;
    var misses = entry.misses;

    if (misses >= MissesToOffline && snapshot.State != DeviceOnlineState.Offline)
    {
      var offline = snapshot with { State = DeviceOnlineState.Offline };
      return (DeviceEventType.Offline, offline);
    }

    if (misses >= MissesToSuspect && snapshot.State == DeviceOnlineState.Online)
    {
      var suspect = snapshot with { State = DeviceOnlineState.Suspect };
      return (DeviceEventType.Updated, suspect);
    }

    return (null, snapshot);
  }

  private void UpdateState(string deviceId, DeviceOnlineState newState, bool emitOffline)
  {
    DeviceSnapshot? updated = null;
    DeviceEventType? eventType = null;

    lock (_mapLock)
    {
      if (_deviceMap.TryGetValue(deviceId, out var value))
      {
        updated = value.snapshot with { State = newState };
        _deviceMap[deviceId] = (updated, value.misses);

        eventType = newState switch
        {
          DeviceOnlineState.Offline => DeviceEventType.Offline,
          _ => DeviceEventType.Updated
        };
      }
    }

    if (updated is null || !eventType.HasValue)
    {
      return;
    }

    _eventBus.Publish(new DeviceEvent(eventType.Value, updated));
    TrySaveSnapshot();
  }

  private void TrySaveSnapshot()
  {
    try
    {
      SaveSnapshot();
    }
    catch (Exception exception)
    {
      _logger.LogWarning(exception, "SaveSnapshot failed");
    }
  }

  /// <summary>Atomic snapshot write with unique temp and backup.</summary>
  public void SaveSnapshot()
  {
    List<DeviceSnapshot> data;

    lock (_mapLock)
    {
      data = _deviceMap.Values.Select(v => v.snapshot).ToList();
    }

    lock (_saveLock)
    {
      var directory = Path.GetDirectoryName(_snapshotPath);
      if (!string.IsNullOrEmpty(directory))
      {
        Directory.CreateDirectory(directory);
      }

      var tempPath = _snapshotPath + "." + Guid.NewGuid().ToString("N") + ".tmp";
      var backupPath = _snapshotPath + ".bak";

      using (var fileStream = new FileStream(
               tempPath, FileMode.CreateNew, FileAccess.Write, FileShare.None,
               bufferSize: 64 * 1024, FileOptions.WriteThrough))
      {
        JsonSerializer.Serialize(fileStream, data, JsonOptions);
        fileStream.Flush(true);
      }

      try
      {
        if (OperatingSystem.IsWindows())
        {
          if (File.Exists(_snapshotPath))
          {
            File.Replace(tempPath, _snapshotPath, backupPath, ignoreMetadataErrors: true);
          }
          else
          {
            File.Move(tempPath, _snapshotPath, overwrite: false);
          }
        }
        else
        {
          File.Move(tempPath, _snapshotPath, overwrite: true);
        }
      }
      finally
      {
        if (File.Exists(tempPath))
        {
          File.Delete(tempPath);
        }
      }
    }
  }
}

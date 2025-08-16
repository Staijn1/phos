using Phos.Orchestrator.Core;
using Phos.Orchestrator.Core.Contracts;

namespace Phos.Orchestrator.Api.Services;

/// <summary>
/// HTTP client that probes a WLED device at /json/info and /json/state,
/// builds a DeviceSnapshot, and upserts it into the registry.
/// </summary>
public sealed class WledProber : IDeviceProber
{
  private readonly HttpClient _http;
  private readonly IDeviceRegistry _reg;
  private readonly IDeviceEventBus _bus;
  private readonly ILogger<WledProber> _logger;

  public WledProber(HttpClient http, IDeviceRegistry reg, IDeviceEventBus bus, ILogger<WledProber> logger)
  {
    _http = http;
    _reg = reg;
    _bus = bus;
    _logger = logger;
  }

  /// <summary>
  /// Fetch /json/info then /json/state from the given IP/port. TXT is used
  /// as a fallback for name/MAC. On success, emits an Updated event.
  /// </summary>
  public async Task ProbeAsync(string ip, int port, IReadOnlyDictionary<string, string> txt, CancellationToken ct)
  {
    _logger.LogDebug("Probing WLED {Ip}:{Port}", ip, port);
    var baseUrl = $"http://{ip}:{port}";
    var info = await _http.GetFromJsonAsync<WledInfo>($"{baseUrl}/json/info", ct);
    if (info is null) return;

    var state = await _http.GetFromJsonAsync<WledState>($"{baseUrl}/json/state", ct) ?? new WledState(new());
    string mac = NormalizeMac(info.mac ?? txt.GetValueOrDefault("mac") ?? txt.GetValueOrDefault("id"));
    if (string.IsNullOrEmpty(mac)) return; // cannot generate stable id

    var segs = state.seg?.Select(s => new SegmentDescription(s.id, s.start, s.len, s.rev)).ToList() ?? new();
    var snap = new DeviceSnapshot(
      DeviceId: mac,
      Name: PickName(info.name, txt),
      Ip: ip,
      Port: port,
      Firmware: info.ver ?? "",
      LedCount: info.leds?.count ?? segs.Sum(s => s.Len),
      FpsCap: 60,
      Segments: segs,
      Capabilities: new DeviceCapabilities(JsonWs: true, Realtime: new[] { "DDP", "E1.31" }),
      LastSeen: DateTimeOffset.UtcNow,
      State: DeviceOnlineState.Online);

    _reg.Upsert(snap);
    _bus.Publish(new DeviceEvent(DeviceEventType.Updated, snap));
  }

  /// <summary>
  /// Normalize a MAC string to lower-case colon-separated form "aa:bb:cc:dd:ee:ff".
  /// Returns empty string if the input cannot be normalized to 12 hex digits.
  /// </summary>
  private static string NormalizeMac(string? raw)
  {
    if (string.IsNullOrWhiteSpace(raw)) return "";
    var s = new string(raw.Trim().ToLowerInvariant().Where(char.IsLetterOrDigit).ToArray());
    if (s.Length != 12) return "";
    return string.Join(":", Enumerable.Range(0, 6).Select(i => s.Substring(i * 2, 2)));
  }

  /// <summary>
  /// Choose a human-friendly device name from /json/info or TXT. Spaces are replaced with dashes.
  /// </summary>
  private static string PickName(string? name, IReadOnlyDictionary<string, string> txt)
    => (name ?? txt.GetValueOrDefault("name") ?? "wled").Trim().Replace("", "-");
}

/// <summary>
/// Abstraction for a component that performs a single HTTP probe against a device.
/// </summary>
public interface IDeviceProber
{
  Task ProbeAsync(string ip, int port, IReadOnlyDictionary<string, string> txt, CancellationToken ct);
}

// Minimal DTOs to deserialize WLED JSON responses.

/// <summary>Subset of /json/info fields used by the orchestrator.</summary>
public sealed record WledInfo(string ver, string mac, WledInfoLeds leds, string name);

/// <summary>LED metadata from /json/info.</summary>
public sealed record WledInfoLeds(int count);

/// <summary>Subset of /json/state with segment list.</summary>
public sealed record WledState(List<WledSeg> seg);

/// <summary>Segment entry from /json/state.</summary>
public sealed record WledSeg(int id, int start, int len, bool rev);

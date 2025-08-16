namespace Phos.Orchestrator.Core.Contracts;

/// <summary>
/// Immutable snapshot of a device at a point in time used by the registry and API.
/// </summary>
public sealed record DeviceSnapshot(
  string DeviceId,         // normalized MAC "aa:bb:..."
  string Name,
  string Ip,
  int Port,
  string Firmware,
  int LedCount,
  int FpsCap,
  IReadOnlyList<SegmentDescription> Segments,
  DeviceCapabilities Capabilities,
  DateTimeOffset LastSeen,
  DeviceOnlineState State);

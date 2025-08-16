// Orchestrator.Core/Registry.cs

using Phos.Orchestrator.Core.Contracts;

namespace Phos.Orchestrator.Core;

/// <summary>
/// In-memory catalog of devices with upsert semantics and state transitions.
/// Thread-safe implementations are required.
/// </summary>
public interface IDeviceRegistry
{
  /// <summary>Return a device snapshot by stable id (normalized MAC) or null.</summary>
  DeviceSnapshot? Get(string deviceId);

  /// <summary>Return all known devices. The order is undefined.</summary>
  IReadOnlyList<DeviceSnapshot> All();

  /// <summary>
  /// Insert or replace a device snapshot. Resets miss counters and sets state to Online.
  /// Implementations should emit Added or Updated events as appropriate.
  /// </summary>
  void Upsert(DeviceSnapshot snap);

  /// <summary>Transition a device into Suspect (missed a few probes).</summary>
  void MarkSuspect(string deviceId);

  /// <summary>Transition a device into Offline (prolonged misses).</summary>
  void MarkOffline(string deviceId);

  /// <summary>Update last known IP/port without changing other fields.</summary>
  void SetIp(string deviceId, string ip, int port);

  /// <summary>Persist the current registry to disk atomically.</summary>
  void SaveSnapshot();
}

/// <summary>Event types emitted when registry entries change.</summary>
public enum DeviceEventType { Added, Updated, Offline }

/// <summary>Registry event payload pushed to subscribers and the API.</summary>
public sealed record DeviceEvent(DeviceEventType Type, DeviceSnapshot Snapshot);

/// <summary>
/// Simple pub/sub bus for device events. Implementations must deliver events
/// in emission order and stop when the token is cancelled.
/// </summary>
public interface IDeviceEventBus
{
  void Publish(DeviceEvent evt);
  IAsyncEnumerable<DeviceEvent> Subscribe(CancellationToken ct);
}

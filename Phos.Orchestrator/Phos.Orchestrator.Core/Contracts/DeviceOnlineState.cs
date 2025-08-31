// Orchestrator.Core/Contracts.cs

namespace Phos.Orchestrator.Core.Contracts;

/// <summary>
/// Online state derived from probe results and timeouts.
/// </summary>
public enum DeviceOnlineState { Online, Suspect, Offline }

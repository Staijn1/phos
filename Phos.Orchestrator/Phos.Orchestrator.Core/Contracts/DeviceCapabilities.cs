namespace Phos.Orchestrator.Core.Contracts;

/// <summary>
/// Device capability flags discovered once and cached.
/// </summary>
/// <param name="JsonWs">WLED JSON/WebSocket control plane available.</param>
/// <param name="Realtime">Realtime transports the device accepts (e.g., "DDP").</param>
public sealed record DeviceCapabilities(bool JsonWs, string[] Realtime);

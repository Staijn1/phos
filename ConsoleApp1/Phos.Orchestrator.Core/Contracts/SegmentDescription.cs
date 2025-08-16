namespace Phos.Orchestrator.Core.Contracts;

/// <summary>
/// Physical WLED segment description as reported by /json/state.
/// </summary>
/// <param name="Id">WLED segment id (0-based).</param>
/// <param name="Start">First LED index on the controller.</param>
/// <param name="Len">Number of LEDs in the segment.</param>
/// <param name="Rev">True if the segment runs in reverse on the device.</param>
public sealed record SegmentDescription(int Id, int Start, int Len, bool Rev);

namespace Phos.Orchestrator.Core.Config
{
  /// <summary>
  /// Immutable, precomputed view of the lighting config for fast mapping.
  /// </summary>
  public sealed class LightingView
  {
    public IReadOnlyDictionary<string, DeviceView> Devices { get; init; } = new Dictionary<string, DeviceView>();
    public IReadOnlyDictionary<string, RoomView> Rooms { get; init; } = new Dictionary<string, RoomView>();
    public IReadOnlyDictionary<string, PriorityConfig> Priorities { get; init; } = new Dictionary<string, PriorityConfig>();
  }

  /// <summary>Runtime device view with fast lookups.</summary>
  public sealed class DeviceView
  {
    public string DeviceId { get; init; } = "";
    public IReadOnlyDictionary<int, SegmentConfig> SegmentsById { get; init; } = new Dictionary<int, SegmentConfig>();
  }

  /// <summary>Runtime room view, used by the mapper each frame.</summary>
  public sealed class RoomView
  {
    public string Name { get; init; } = "";
    public IReadOnlyDictionary<string, int> SectionLengths { get; init; } = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
    public IReadOnlyList<MappingPlan> Mappings { get; init; } = new List<MappingPlan>();
    public TransformConfig Transforms { get; init; } = new TransformConfig();
  }

  /// <summary>Precomputed mapping instruction.</summary>
  public sealed class MappingPlan
  {
    public string Section { get; init; } = "";
    public int LogicalStart { get; init; }
    public int LogicalLength { get; init; }
    public string DeviceId { get; init; } = "";
    public int TargetSegmentId { get; init; }
    public int TargetAbsoluteStart { get; init; }   // device segment start + offset
    public bool Reverse { get; init; }              // apply reversal on copy
  }
}

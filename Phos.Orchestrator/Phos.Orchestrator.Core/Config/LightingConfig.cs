using System.ComponentModel.DataAnnotations;

namespace Phos.Orchestrator.Core.Config
{
  /// <summary>
  /// Root configuration for lighting. Bind from appsettings section "Lighting".
  /// </summary>
  public sealed class LightingConfig
  {
    /// <summary>Devices keyed by stable id (prefer MAC in lower-case).</summary>
    [Required]
    public Dictionary<string, DeviceConfig> Devices { get; set; } = new();

    /// <summary>Rooms keyed by name.</summary>
    [Required]
    public Dictionary<string, RoomConfig> Rooms { get; set; } = new();

    /// <summary>Priority definitions per source type.</summary>
    [Required]
    public Dictionary<string, PriorityConfig> Priorities { get; set; } = new();
  }

  /// <summary>Device configuration container.</summary>
  public sealed class DeviceConfig
  {
    /// <summary>Physical segments as configured on WLED.</summary>
    [Required]
    public List<SegmentConfig> Segments { get; set; } = new();
  }

  /// <summary>Physical WLED segment.</summary>
  public sealed class SegmentConfig
  {
    /// <summary>Segment id on the device (0-based).</summary>
    public int Id { get; set; }

    /// <summary>Start LED index on device.</summary>
    public int Start { get; set; }

    /// <summary>Number of LEDs in the segment.</summary>
    public int Len { get; set; }

    /// <summary>True if LED order is reversed on the device.</summary>
    public bool Rev { get; set; }
  }

  /// <summary>Room definition with logical sections and mappings.</summary>
  public sealed class RoomConfig
  {
    /// <summary>Logical sections this room renders.</summary>
    [Required]
    public List<SectionConfig> Sections { get; set; } = new();

    /// <summary>Declarative logical→physical mapping rules.</summary>
    [Required]
    public List<MappingConfig> Mappings { get; set; } = new();

    /// <summary>Optional brightness/gamma transforms.</summary>
    public TransformConfig? Transforms { get; set; }
  }

  /// <summary>Logical section within a room.</summary>
  public sealed class SectionConfig
  {
    /// <summary>Section name referenced by mappings.</summary>
    [Required]
    public string Name { get; set; } = "";

    /// <summary>Length in logical pixels.</summary>
    public int Len { get; set; }
  }

  /// <summary>One mapping rule from a logical range to a device segment.</summary>
  public sealed class MappingConfig
  {
    /// <summary>Logical section name.</summary>
    [Required]
    public string Section { get; set; } = "";

    /// <summary>Half-open logical range [start, end). Represented as two-element array.</summary>
    [Required]
    public int[] From { get; set; } = Array.Empty<int>();

    /// <summary>Target device id (key from Devices).</summary>
    [Required]
    public string Device { get; set; } = "";

    /// <summary>Target segment id on the device.</summary>
    public int Seg { get; set; }

    /// <summary>Direction: "fwd" or "rev".</summary>
    [Required]
    public string Dir { get; set; } = "fwd";

    /// <summary>Optional start offset inside the target segment.</summary>
    public int? Offset { get; set; }
  }

  /// <summary>Global and per-section transform settings.</summary>
  public sealed class TransformConfig
  {
    /// <summary>Gamma correction (e.g., 2.2). Defaults to 1.0 if not set.</summary>
    public double? Gamma { get; set; }

    /// <summary>Overall brightness multiplier (1.0 = unchanged).</summary>
    public double? Brightness { get; set; }

    /// <summary>Per-section overrides by section name.</summary>
    public Dictionary<string, TransformOverride> PerSection { get; set; } = new();
  }

  /// <summary>Per-section transform override.</summary>
  public sealed class TransformOverride
  {
    public double? Gamma { get; set; }
    public double? Brightness { get; set; }
  }

  /// <summary>Priority and TTL for a source class.</summary>
  public sealed class PriorityConfig
  {
    /// <summary>Priority numeric value. Higher wins.</summary>
    public int Value { get; set; }

    /// <summary>Time-to-live in milliseconds for activity heartbeats.</summary>
    public int TtlMs { get; set; }
  }
}

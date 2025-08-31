using Microsoft.Extensions.Options;

namespace Phos.Orchestrator.Core.Config
{
  /// <summary>
  /// Detailed validation result with errors and warnings.
  /// </summary>
  public sealed class LightingValidationResult
  {
    public bool Ok => Errors.Count == 0;
    public List<string> Errors { get; } = new();
    public List<string> Warnings { get; } = new();
  }

  /// <summary>
  /// Public validator interface to get detailed results at runtime.
  /// </summary>
  public interface ILightingConfigValidator
  {
    LightingValidationResult Validate(LightingConfig config);
  }

  /// <summary>
  /// Implementation of both ASP.NET options validator and a detailed validator.
  /// </summary>
  public sealed class LightingConfigValidator :
    ILightingConfigValidator,
    IValidateOptions<LightingConfig>
  {
    public ValidateOptionsResult Validate(string? name, LightingConfig config)
    {
      LightingValidationResult detailed = Validate(config);
      if (detailed.Ok)
      {
        return ValidateOptionsResult.Success;
      }

      return ValidateOptionsResult.Fail(detailed.Errors);
    }

    public LightingValidationResult Validate(LightingConfig config)
    {
      var result = new LightingValidationResult();

      // Devices
      foreach (var (deviceId, device) in config.Devices)
      {
        var seenSegIds = new HashSet<int>();
        foreach (var seg in device.Segments)
        {
          if (seg.Len <= 0)
          {
            result.Errors.Add($"Device {deviceId}: segment {seg.Id} has non-positive len.");
          }

          if (!seenSegIds.Add(seg.Id))
          {
            result.Errors.Add($"Device {deviceId}: duplicate segment id {seg.Id}.");
          }
        }

        // Overlap check per device
        foreach (var a in device.Segments)
        {
          foreach (var b in device.Segments)
          {
            if (a.Id >= b.Id) { continue; }
            bool overlaps = RangeOverlaps(a.Start, a.Len, b.Start, b.Len);
            if (overlaps)
            {
              result.Errors.Add($"Device {deviceId}: segments {a.Id} and {b.Id} overlap.");
            }
          }
        }
      }

      // Rooms
      foreach (var (roomName, room) in config.Rooms)
      {
        var sectionLen = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        foreach (var section in room.Sections)
        {
          if (string.IsNullOrWhiteSpace(section.Name))
          {
            result.Errors.Add($"Room {roomName}: section with empty name.");
          }
          else if (sectionLen.ContainsKey(section.Name))
          {
            result.Errors.Add($"Room {roomName}: duplicate section name '{section.Name}'.");
          }
          else
          {
            if (section.Len <= 0)
            {
              result.Errors.Add($"Room {roomName}: section '{section.Name}' has non-positive len.");
            }
            sectionLen[section.Name] = section.Len;
          }
        }

        // Mapping validations
        var destWrites = new Dictionary<(string dev, int seg), List<(int start, int len)>>();

        for (int i = 0; i < room.Mappings.Count; i++)
        {
          var m = room.Mappings[i];
          string where = $"Room {roomName} mapping[{i}]";

          if (!sectionLen.TryGetValue(m.Section, out int logicalLen))
          {
            result.Errors.Add($"{where}: references unknown section '{m.Section}'.");
            continue;
          }

          if (m.From is null || m.From.Length != 2)
          {
            result.Errors.Add($"{where}: 'from' must be an array [start,end).");
            continue;
          }

          int fromStart = m.From[0];
          int fromEnd = m.From[1];
          if (fromStart < 0 || fromEnd < 0 || fromEnd <= fromStart || fromEnd > logicalLen)
          {
            result.Errors.Add($"{where}: invalid from range [{fromStart},{fromEnd}) for section length {logicalLen}.");
          }

          if (!config.Devices.TryGetValue(m.Device, out var device))
          {
            result.Errors.Add($"{where}: unknown device '{m.Device}'.");
            continue;
          }

          var seg = device.Segments.FirstOrDefault(s => s.Id == m.Seg);
          if (seg is null)
          {
            result.Errors.Add($"{where}: device '{m.Device}' has no segment id {m.Seg}.");
            continue;
          }

          int mapLen = Math.Max(0, fromEnd - fromStart);
          int offset = m.Offset ?? 0;
          if (offset < 0 || offset + mapLen > seg.Len)
          {
            result.Errors.Add($"{where}: destination overflows segment {m.Seg} (offset {offset} + len {mapLen} > {seg.Len}).");
          }

          if (!string.Equals(m.Dir, "fwd", StringComparison.OrdinalIgnoreCase) &&
              !string.Equals(m.Dir, "rev", StringComparison.OrdinalIgnoreCase))
          {
            result.Errors.Add($"{where}: dir must be 'fwd' or 'rev'.");
          }

          var key = (m.Device, m.Seg);
          if (!destWrites.TryGetValue(key, out var spans))
          {
            spans = new List<(int, int)>();
            destWrites[key] = spans;
          }
          spans.Add((seg.Start + offset, mapLen));
        }

        // Overlapping destination writes within the same device/segment
        foreach (var ((dev, segId), spans) in destWrites)
        {
          spans.Sort((a, b) => a.start.CompareTo(b.start));
          for (int j = 1; j < spans.Count; j++)
          {
            var prev = spans[j - 1];
            var curr = spans[j];
            bool overlaps = prev.start + prev.len > curr.start;
            if (overlaps)
            {
              result.Errors.Add($"Room {roomName}: overlapping writes to {dev}/seg {segId} at [{prev.start},{prev.start + prev.len}) and [{curr.start},{curr.start + curr.len}).");
            }
          }
        }

        // Warning if some section ranges are unmapped
        foreach (var section in room.Sections)
        {
          int covered = room.Mappings
            .Where(x => string.Equals(x.Section, section.Name, StringComparison.OrdinalIgnoreCase))
            .Sum(x => Math.Max(0, (x.From?[1] ?? 0) - (x.From?[0] ?? 0)));
          if (covered < section.Len)
          {
            result.Warnings.Add($"Room {roomName}: section '{section.Name}' has {section.Len - covered} unmapped pixels.");
          }
        }
      }

      // Priorities
      foreach (var (name, pr) in config.Priorities)
      {
        if (pr.Value < 0)
        {
          result.Errors.Add($"Priority '{name}': value must be >= 0.");
        }
        if (pr.TtlMs < 50 || pr.TtlMs > 60_000)
        {
          result.Errors.Add($"Priority '{name}': ttl_ms out of range [50, 60000].");
        }
      }

      return result;
    }

    private static bool RangeOverlaps(int aStart, int aLen, int bStart, int bLen)
    {
      int aEnd = aStart + aLen;
      int bEnd = bStart + bLen;
      return aStart < bEnd && bStart < aEnd;
    }
  }
}

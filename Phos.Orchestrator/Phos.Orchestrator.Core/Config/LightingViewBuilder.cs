namespace Phos.Orchestrator.Core.Config
{
  /// <summary>
  /// Builds an immutable <see cref="LightingView"/> from <see cref="LightingConfig"/>.
  /// Assumes input is validated; throws on unrecoverable contradictions.
  /// </summary>
  public sealed class LightingViewBuilder
  {
    public LightingView Build(LightingConfig config)
    {
      var devices = new Dictionary<string, DeviceView>(config.Devices.Count, StringComparer.OrdinalIgnoreCase);
      foreach (var (deviceId, deviceCfg) in config.Devices)
      {
        devices[deviceId] = new DeviceView
        {
          DeviceId = deviceId,
          SegmentsById = deviceCfg.Segments.ToDictionary(s => s.Id, s => s)
        };
      }

      var rooms = new Dictionary<string, RoomView>(config.Rooms.Count, StringComparer.OrdinalIgnoreCase);

      foreach (var (roomName, roomCfg) in config.Rooms)
      {
        var sectionLengths = roomCfg.Sections.ToDictionary(s => s.Name, s => s.Len, StringComparer.OrdinalIgnoreCase);
        var plans = new List<MappingPlan>(roomCfg.Mappings.Count);

        foreach (var m in roomCfg.Mappings)
        {
          int fromStart = m.From[0];
          int fromEnd = m.From[1];
          int logicalLen = fromEnd - fromStart;

          var deviceView = devices[m.Device];
          var seg = deviceView.SegmentsById[m.Seg];
          int offset = m.Offset ?? 0;

          plans.Add(new MappingPlan
          {
            Section = m.Section,
            LogicalStart = fromStart,
            LogicalLength = logicalLen,
            DeviceId = m.Device,
            TargetSegmentId = m.Seg,
            TargetAbsoluteStart = seg.Start + offset,
            Reverse = string.Equals(m.Dir, "rev", StringComparison.OrdinalIgnoreCase)
          });
        }

        rooms[roomName] = new RoomView
        {
          Name = roomName,
          SectionLengths = sectionLengths,
          Mappings = plans,
          Transforms = roomCfg.Transforms ?? new TransformConfig { Brightness = 1.0, Gamma = 1.0 }
        };
      }

      return new LightingView
      {
        Devices = devices,
        Rooms = rooms,
        Priorities = new Dictionary<string, PriorityConfig>(config.Priorities, StringComparer.OrdinalIgnoreCase)
      };
    }
  }
}

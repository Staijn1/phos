// Phos.Orchestrator.Api/Controllers/ConfigController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Phos.Orchestrator.Api.Services;
using Phos.Orchestrator.Core.Config;

namespace Phos.Orchestrator.Api.Controllers
{
  /// <summary>
  /// Config inspection and dry-run mapping endpoints.
  /// </summary>
  [ApiController]
  [Route("[controller]")]
  public sealed class ConfigController : ControllerBase
  {
    private readonly IOptionsMonitor<LightingConfig> _options;
    private readonly ILightingConfigValidator _validator;
    private readonly ILightingViewProvider _viewProvider;
    private readonly ILogger<ConfigController> _logger;

    public ConfigController(
      IOptionsMonitor<LightingConfig> options,
      ILightingConfigValidator validator,
      ILightingViewProvider viewProvider,
      ILogger<ConfigController> logger)
    {
      _options = options;
      _validator = validator;
      _viewProvider = viewProvider;
      _logger = logger;
    }

    /// <summary>Return the currently bound Lighting section.</summary>
    [HttpGet("lighting")]
    public ActionResult<LightingConfig> Get() => Ok(_options.CurrentValue);

    /// <summary>Validate the current config and return errors and warnings.</summary>
    [HttpGet("lighting/validate")]
    public ActionResult<object> ValidateConfig()
    {
      var res = _validator.Validate(_options.CurrentValue);
      return Ok(new { ok = res.Ok, errors = res.Errors, warnings = res.Warnings });
    }

    /// <summary>
    /// Dry-run the mapping pipeline for a room. Body provides per-section RGB bytes as base64.
    /// Returns per-device RGB bytes as base64, without sending to hardware.
    /// </summary>
    [HttpPost("lighting/dry-run/{roomName}")]
    public ActionResult<object> DryRun(string roomName, [FromBody] DryRunRequest request)
    {
      var view = _viewProvider.Current;
      if (!view.Rooms.TryGetValue(roomName, out var room))
      {
        return NotFound(new { error = $"Room '{roomName}' not found." });
      }

      // Build section pixel sources
      var sectionBuffers = new Dictionary<string, byte[]>(StringComparer.OrdinalIgnoreCase);
      foreach (var (name, base64) in request.Sections)
      {
        byte[] bytes;
        try { bytes = Convert.FromBase64String(base64); }
        catch { return BadRequest(new { error = $"Section '{name}' base64 invalid." }); }

        if (!room.SectionLengths.TryGetValue(name, out var expectedLen))
        {
          return BadRequest(new { error = $"Section '{name}' not defined in room." });
        }

        var expectedBytes = expectedLen * 3;
        if (bytes.Length != expectedBytes)
        {
          return BadRequest(new { error = $"Section '{name}' expected {expectedBytes} bytes (len={expectedLen} * 3), got {bytes.Length}." });
        }

        sectionBuffers[name] = bytes;
      }

      // Output per device buffers sized by max segment end
      var deviceBuffers = new Dictionary<string, byte[]>();
      foreach (var (deviceId, device) in view.Devices)
      {
        var totalLen = device.SegmentsById.Values.Max(s => s.Start + s.Len);
        deviceBuffers[deviceId] = new byte[totalLen * 3];
      }

      // Copy according to mapping plans
      foreach (var plan in room.Mappings)
      {
        if (!sectionBuffers.TryGetValue(plan.Section, out var src))
        {
          return BadRequest(new { error = $"Missing pixels for section '{plan.Section}'." });
        }

        if (!view.Devices.TryGetValue(plan.DeviceId, out var device))
        {
          return BadRequest(new { error = $"Device '{plan.DeviceId}' not found." });
        }

        if (!deviceBuffers.TryGetValue(plan.DeviceId, out var dst))
        {
          return BadRequest(new { error = $"Internal: no buffer for device '{plan.DeviceId}'." });
        }

        // Slice from section
        var count = plan.LogicalLength;
        var srcByteStart = plan.LogicalStart * 3;

        // Copy with optional reverse
        if (!plan.Reverse)
        {
          Buffer.BlockCopy(src, srcByteStart, dst, (plan.TargetAbsoluteStart) * 3, count * 3);
        }
        else
        {
          // reverse copy per pixel
          for (var i = 0; i < count; i++)
          {
            var s = srcByteStart + (i * 3);
            var d = (plan.TargetAbsoluteStart + (count - 1 - i)) * 3;
            dst[d + 0] = src[s + 0];
            dst[d + 1] = src[s + 1];
            dst[d + 2] = src[s + 2];
          }
        }
      }

      // Encode base64 outputs
      var devicesOut = deviceBuffers.ToDictionary(kv => kv.Key, kv => Convert.ToBase64String(kv.Value));
      return Ok(new { devices = devicesOut });
    }
  }

  /// <summary>Request body for dry-run mapping: base64 RGB bytes per section.</summary>
  public sealed class DryRunRequest
  {
    /// <summary>Map of section name → base64-encoded RGB byte array of length section.Len*3.</summary>
    public Dictionary<string, string> Sections { get; set; } = new();
  }
}

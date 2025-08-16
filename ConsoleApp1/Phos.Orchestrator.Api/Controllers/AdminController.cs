using Microsoft.AspNetCore.Mvc;
using Phos.Orchestrator.Api.Services;
using Phos.Orchestrator.Core;

namespace Phos.Orchestrator.Api.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class AdminController : ControllerBase
{
  private readonly IDeviceRegistry _reg;
  private readonly IDeviceProber _prober;

  public AdminController(IDeviceRegistry reg, IDeviceProber prober)
  {
    _reg = reg;
    _prober = prober;
  }

  /// <summary>Trigger a single HTTP probe against the device’s current IP/port.</summary>
  [HttpPost("devices/{id}/probe")]
  [ProducesResponseType(StatusCodes.Status202Accepted)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> ProbeNow(string id, CancellationToken ct)
  {
    var d = _reg.Get(id);
    if (d is null) return NotFound();
    await _prober.ProbeAsync(d.Ip, d.Port, new Dictionary<string, string>(), ct);
    return Accepted();
  }
}

using Microsoft.AspNetCore.Mvc;
using Phos.Orchestrator.Core;
using Phos.Orchestrator.Core.Contracts;

namespace Phos.Orchestrator.Api.Controllers;

/// <summary>
/// Read-only device catalog from the registry. Id is normalized MAC (aa:bb:..).
/// </summary>
[ApiController]
[Route("[controller]")]
public sealed class DevicesController : ControllerBase
{
  private readonly IDeviceRegistry _registry;

  public DevicesController(IDeviceRegistry registry) => _registry = registry;

  /// <summary>
  /// Returns all known devices as last seen by discovery/probing.
  /// </summary>
  [HttpGet]
  [ProducesResponseType(typeof(IReadOnlyList<DeviceSnapshot>), StatusCodes.Status200OK)]
  public ActionResult<IReadOnlyList<DeviceSnapshot>> GetAll() => Ok(_registry.All());

  /// <summary>
  /// Returns details for a single device by id.
  /// </summary>
  [HttpGet("{id}")]
  [ProducesResponseType(typeof(DeviceSnapshot), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public ActionResult<DeviceSnapshot> GetById(string id)
  {
    var d = _registry.Get(id);
    return d is null ? NotFound() : Ok(d);
  }
}

using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Phos.Orchestrator.Core;

namespace Phos.Orchestrator.Api.Controllers;

/// <summary>
/// Server-Sent Events stream of device lifecycle events.
/// Each message is a JSON serialized DeviceEvent preceded by "data:" per SSE spec.
/// </summary>
[ApiController]
[Route("[controller]")]
public sealed class EventsController : ControllerBase
{
  private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

  private readonly IDeviceEventBus _bus;
  public EventsController(IDeviceEventBus bus) => _bus = bus;

  /// <summary>
  /// Opens a text/event-stream. Closes when the client disconnects or the server shuts down.
  /// </summary>
  [HttpGet]
  public async Task Get(CancellationToken ct)
  {
    Response.Headers.CacheControl = "no-cache";
    Response.Headers["Content-Type"] = "text/event-stream";
    Response.Headers["X-Accel-Buffering"] = "no"; // disable proxy buffering if any

    await foreach (var evt in _bus.Subscribe(ct))
    {
      // Write SSE frame
      var json = JsonSerializer.Serialize(evt, _json);
      await Response.WriteAsync("data:", ct);
      await Response.WriteAsync(json, ct);
      await Response.WriteAsync("\n\n", ct);
      await Response.Body.FlushAsync(ct);
    }
  }
}

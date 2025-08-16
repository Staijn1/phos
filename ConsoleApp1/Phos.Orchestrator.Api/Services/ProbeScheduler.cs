using System.Threading.Channels;
using Phos.Orchestrator.Core;
using Phos.Orchestrator.Core.Contracts;

namespace Phos.Orchestrator.Api.Services;

/// <summary>
/// Executes HTTP probes from the mDNS queue with bounded concurrency and
/// runs periodic per-device polls with jitter. Applies the Online→Suspect→Offline policy.
/// </summary>
public sealed class ProbeScheduler : BackgroundService
{
  private readonly Channel<(string ip, int port, IReadOnlyDictionary<string, string> txt)> _probeQ;
  private readonly IDeviceProber _prober;
  private readonly IDeviceRegistry _registry;
  private readonly ILogger<ProbeScheduler> _logger;

  /// <summary>
  /// Global concurrency limit for ad-hoc probes. Prevents bursts that could
  /// overload the network or the target devices.
  /// </summary>
  private readonly SemaphoreSlim _concurrency = new(4);

  public ProbeScheduler(
    Channel<(string, int, IReadOnlyDictionary<string, string>)> probeQ,
    IDeviceProber prober,
    IDeviceRegistry registry,
    ILogger<ProbeScheduler> logger)
  {
    _probeQ = probeQ;
    _prober = prober;
    _registry = registry;
    _logger = logger;
  }

  /// <summary>
  /// Main loop: drains the probe queue and schedules periodic polls.
  /// Periodic polls are fire-and-forget tasks with randomized delay.
  /// </summary>
  protected override async Task ExecuteAsync(CancellationToken ct)
  {
    _ = RunPeriodicPolls(ct); // background poller
    while (await _probeQ.Reader.WaitToReadAsync(ct))
    while (_probeQ.Reader.TryRead(out var item))
    {
      await _concurrency.WaitAsync(ct);
      _ = Task.Run(async () =>
      {
        try
        {
          await _prober.ProbeAsync(item.ip, item.port, item.txt, ct);
        }
        finally
        {
          _concurrency.Release();
        }
      }, ct);
    }
  }

  /// <summary>
  /// Periodically probes all known devices with cadence based on state:
  /// Online=10s, Suspect=20s, Offline=40s plus ±15% jitter.
  /// </summary>
  private async Task RunPeriodicPolls(CancellationToken ct)
  {
    var rnd = new Random();
    while (!ct.IsCancellationRequested)
    {
      foreach (var d in _registry.All())
      {
        var jitter = TimeSpan.FromMilliseconds(rnd.Next(-1500, 1500));
        var delay = d.State switch
        {
          DeviceOnlineState.Online => TimeSpan.FromSeconds(10),
          DeviceOnlineState.Suspect => TimeSpan.FromSeconds(20),
          _ => TimeSpan.FromSeconds(40),
        } + jitter;

        _ = Task.Delay(delay, ct).ContinueWith(async _ =>
        {
          try
          {
            await _prober.ProbeAsync(d.Ip, d.Port, new Dictionary<string, string>(), ct);
          }
          catch
          {
            /* miss counters handled by registry in your implementation */
          }
        }, ct);
      }

      await Task.Delay(TimeSpan.FromSeconds(5), ct);
    }
  }
}

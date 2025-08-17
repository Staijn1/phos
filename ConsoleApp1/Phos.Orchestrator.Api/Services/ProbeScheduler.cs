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
  protected override async Task ExecuteAsync(CancellationToken cancellationToken)
  {
    _ = RunPeriodicPolls(cancellationToken);

    while (await _probeQ.Reader.WaitToReadAsync(cancellationToken))
    while (_probeQ.Reader.TryRead(out var workItem))
    {
      await _concurrency.WaitAsync(cancellationToken);
      _ = Task.Run(async () =>
      {
        try
        {
          _logger.LogDebug("Ad-hoc probe for {Ip}:{Port}", workItem.ip, workItem.port);
          await _prober.ProbeAsync(workItem.ip, workItem.port, workItem.txt, cancellationToken);
        }
        catch (Exception exception)
        {
          _logger.LogError(exception, "Ad-hoc probe failed for {Ip}:{Port}", workItem.ip, workItem.port);
          _registry.NoteProbeMissByIp(workItem.ip);
        }
        finally
        {
          _concurrency.Release();
        }
      }, cancellationToken);
    }
  }

  /// <summary>
  /// Periodically probes all known devices with cadence based on state:
  /// Online=10s, Suspect=20s, Offline=40s plus ±15% jitter.
  /// </summary>
  private async Task RunPeriodicPolls(CancellationToken cancellationToken)
  {
    var random = new Random();

    while (!cancellationToken.IsCancellationRequested)
    {
      foreach (var device in _registry.All())
      {
        var jitter = TimeSpan.FromMilliseconds(random.Next(-1500, 1500));
        var delay = device.State switch
        {
          DeviceOnlineState.Online  => TimeSpan.FromSeconds(15),
          DeviceOnlineState.Suspect => TimeSpan.FromSeconds(30),
          _                         => TimeSpan.FromSeconds(45),
        } + jitter;

        _ = Task.Delay(delay, cancellationToken).ContinueWith(async _ =>
        {
          try
          {
            _logger.LogDebug("Periodic probe for {DeviceId} {Ip}:{Port}", device.DeviceId, device.Ip, device.Port);
            await _prober.ProbeAsync(device.Ip, device.Port, new Dictionary<string, string>(), cancellationToken);
          }
          catch (Exception exception)
          {
            _logger.LogDebug(exception, "Periodic probe failed for {DeviceId} {Ip}:{Port}", device.DeviceId, device.Ip, device.Port);
            _registry.NoteProbeMissById(device.DeviceId);
          }
        }, cancellationToken);
      }

      await Task.Delay(TimeSpan.FromSeconds(15), cancellationToken);
    }
  }
}

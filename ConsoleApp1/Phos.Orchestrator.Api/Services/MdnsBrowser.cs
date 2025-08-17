using System.Collections.Concurrent;
using System.Threading.Channels;
using Phos.Orchestrator.Core;
using Phos.Orchestrator.Core.Contracts;
using Zeroconf;

namespace Phos.Orchestrator.Api.Services
{
  /// <summary>
  /// Continuously browses mDNS for <c>_wled._tcp.local.</c> and enqueues probe work
  /// for newly seen or stale endpoints. Healthy devices already tracked by the registry
  /// are cooled down to avoid duplicate probing while periodic polls run.
  /// </summary>
  public sealed class MdnsBrowser : BackgroundService
  {
    /// <summary>
    /// Minimum time between enqueue operations for the same <c>ip:port</c>.
    /// Prevents repeated ad-hoc probes for healthy devices.
    /// </summary>
    private static readonly TimeSpan EnqueueCooldown = TimeSpan.FromSeconds(60);

    /// <summary>
    /// mDNS scan duration passed to Zeroconf for each Resolve call.
    /// </summary>
    private static readonly TimeSpan ScanTime = TimeSpan.FromSeconds(5);

    /// <summary>
    /// Delay between scans to keep discovery “always on” without tight looping.
    /// </summary>
    private static readonly TimeSpan ScanPause = TimeSpan.FromSeconds(30);

    /// <summary>
    /// If a device was seen within this window and is Online, the browser will
    /// skip enqueueing and let the periodic poller handle it.
    /// </summary>
    private static readonly TimeSpan FreshSeen = TimeSpan.FromSeconds(15);

    /// <summary>
    /// Probe work queue carrying (ip, tcp port, TXT properties) tuples to the scheduler.
    /// </summary>
    private readonly Channel<(string ip, int port, IReadOnlyDictionary<string, string> txt)> _probeQueue;

    /// <summary>
    /// Device registry used to determine which endpoints are already healthy and fresh.
    /// </summary>
    private readonly IDeviceRegistry _registry;

    /// <summary>
    /// Logger instance for diagnostics.
    /// </summary>
    private readonly ILogger<MdnsBrowser> _logger;

    /// <summary>
    /// Tracks the last enqueue time per endpoint key <c>ip:port</c> to enforce cooldown.
    /// </summary>
    private readonly ConcurrentDictionary<string, DateTimeOffset> _lastEnqueueByEndpoint = new();

    /// <summary>
    /// Creates a new <see cref="MdnsBrowser"/> that writes discovered endpoints to a probe queue.
    /// </summary>
    /// <param name="probeQueue">Shared channel consumed by the probe scheduler.</param>
    /// <param name="registry">Device registry for deduping healthy devices.</param>
    /// <param name="logger">Logger for this component.</param>
    public MdnsBrowser(
      Channel<(string, int, IReadOnlyDictionary<string, string>)> probeQueue,
      IDeviceRegistry registry,
      ILogger<MdnsBrowser> logger)
    {
      _probeQueue = probeQueue;
      _registry = registry;
      _logger = logger;
    }

    /// <summary>
    /// Main loop: performs repeated Zeroconf Resolve calls and conditionally enqueues
    /// probe requests for endpoints that are new, stale, suspect/offline, or out of cooldown.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token from the host.</param>
    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
      _logger.LogInformation("MdnsBrowser started");

      while (!cancellationToken.IsCancellationRequested)
      {
        var hosts = await ZeroconfResolver.ResolveAsync(
          "_wled._tcp.local.",
          scanTime: ScanTime,
          retries: 2,
          retryDelayMilliseconds: 200,
          cancellationToken: cancellationToken);

        _logger.LogDebug("mDNS scan found {Count} host(s)", hosts.Count);

        foreach (var host in hosts)
        {
          // Prefer IPv4 on typical Wi-Fi/LAN setups.
          var ipAddress =
            host.IPAddresses?.FirstOrDefault(a => a.Contains('.')) ?? host.IPAddress;

          if (string.IsNullOrEmpty(ipAddress))
          {
            continue;
          }

          foreach (var service in host.Services.Values)
          {
            var txt = FlattenProperties(service.Properties);
            var endpointKey = $"{ipAddress}:{service.Port}";

            if (!ShouldEnqueue(ipAddress, service.Port, endpointKey))
            {
              continue;
            }

            _logger.LogDebug("Enqueue probe {Ip}:{Port}", ipAddress, service.Port);
            await _probeQueue.Writer.WriteAsync((ipAddress, service.Port, txt), cancellationToken);
            _lastEnqueueByEndpoint[endpointKey] = DateTimeOffset.UtcNow;
          }
        }

        await Task.Delay(ScanPause, cancellationToken);
      }
    }

    /// <summary>
    /// Determines whether an endpoint should be enqueued for probing.
    /// Skips enqueueing when:
    /// <list type="bullet">
    /// <item><description>It is within the cooldown window for the same <c>ip:port</c>.</description></item>
    /// <item><description>The registry has a device Online at the same <c>ip:port</c> with recent <see cref="DeviceSnapshot.LastSeen"/>.</description></item>
    /// </list>
    /// Returns <c>true</c> when the endpoint is new, stale, suspect/offline, or past cooldown.
    /// </summary>
    /// <param name="ip">IPv4 address from Zeroconf.</param>
    /// <param name="port">TCP port from Zeroconf service.</param>
    /// <param name="endpointKey">Key formatted as <c>ip:port</c>.</param>
    private bool ShouldEnqueue(string ip, int port, string endpointKey)
    {
      // Cooldown per endpoint to avoid repeated ad-hoc probes.
      if (_lastEnqueueByEndpoint.TryGetValue(endpointKey, out var lastEnqueue) &&
          (DateTimeOffset.UtcNow - lastEnqueue) < EnqueueCooldown)
      {
        return false;
      }

      // If a device is already Online at this endpoint and was seen recently, skip.
      var known = _registry.All().FirstOrDefault(d => d.Ip == ip && d.Port == port);
      if (known is not null &&
          known.State == DeviceOnlineState.Online &&
          (DateTimeOffset.UtcNow - known.LastSeen) < FreshSeen)
      {
        return false;
      }

      return true;
    }

    /// <summary>
    /// Flattens Zeroconf TXT properties (a list of dictionaries) into a single
    /// case-insensitive dictionary. Later keys override earlier ones.
    /// </summary>
    /// <param name="properties">TXT property sets from Zeroconf.</param>
    /// <returns>Flattened key/value map suitable to pass to the prober.</returns>
    private static IReadOnlyDictionary<string, string> FlattenProperties(
      IReadOnlyList<IReadOnlyDictionary<string, string>> properties)
    {
      var dictionary = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

      if (properties != null)
      {
        foreach (var set in properties)
        {
          foreach (var kv in set)
          {
            dictionary[kv.Key.ToLowerInvariant()] = kv.Value ?? string.Empty;
          }
        }
      }

      return dictionary;
    }
  }
}

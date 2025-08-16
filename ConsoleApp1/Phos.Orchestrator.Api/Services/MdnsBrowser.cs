using System.Threading.Channels;
using Zeroconf;

/// <summary>
/// Continuous mDNS browser for _wled._tcp that pushes probe work to a queue.
/// Does not modify the registry directly.
/// </summary>
public sealed class MdnsBrowser : BackgroundService
{
  /// <summary>Probe work queue: (ip, tcp port, TXT kv map).</summary>
  private readonly Channel<(string ip, int port, IReadOnlyDictionary<string, string> txt)> _probeQ;

  private readonly ILogger<MdnsBrowser> _logger;

  public MdnsBrowser(Channel<(string, int, IReadOnlyDictionary<string, string>)> probeQ, ILogger<MdnsBrowser> logger)
  {
    _probeQ = probeQ;
    _logger = logger;
  }

  /// <summary>
  /// Resolve _wled._tcp.local, then enqueue one probe per {host,service}.
  /// Uses retries to smooth transient misses.
  /// </summary>
  protected override async Task ExecuteAsync(CancellationToken ct)
  {
    _logger.LogInformation("MdnsBrowser started");
    while (!ct.IsCancellationRequested)
    {
      var hosts = await ZeroconfResolver.ResolveAsync(
        "_wled._tcp.local.",
        scanTime: TimeSpan.FromSeconds(3),
        retries: 2,
        retryDelayMilliseconds: 200,
        cancellationToken: ct);

      _logger.LogDebug("mDNS scan found {Count} host(s)", hosts.Count);

      foreach (var h in hosts)
      {
        // Prefer IPv4 if available
        var ip = h.IPAddresses?.FirstOrDefault(a => a.Contains('.')) ?? h.IPAddress;
        if (string.IsNullOrEmpty(ip)) continue;

        foreach (var svc in h.Services.Values)
        {
          var txt = FlattenProperties(svc.Properties);
          _logger.LogDebug("Enqueue probe {Ip}:{Port}", ip, svc.Port);
          await _probeQ.Writer.WriteAsync((ip, svc.Port, txt), ct);
        }
      }

      await Task.Delay(1500, ct);
    }
  }

  /// <summary>Flattens IService.Properties (list of TXT dictionaries) into one map. Later keys win.</summary>
  private static IReadOnlyDictionary<string, string> FlattenProperties(
    IReadOnlyList<IReadOnlyDictionary<string, string>> props)
  {
    var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
    if (props != null)
    {
      foreach (var set in props)
      foreach (var kv in set)
        dict[kv.Key.ToLowerInvariant()] = kv.Value ?? string.Empty;
    }

    return dict;
  }
}

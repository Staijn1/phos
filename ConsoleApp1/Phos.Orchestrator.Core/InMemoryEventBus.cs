using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using System.Threading.Channels;

namespace Phos.Orchestrator.Core;

public class InMemoryEventBus : IDeviceEventBus
{
  private readonly ConcurrentDictionary<Guid, Channel<DeviceEvent>> _subs = new();

  public void Publish(DeviceEvent evt)
  {
    foreach (var ch in _subs.Values)
      ch.Writer.TryWrite(evt);
  }

  public async IAsyncEnumerable<DeviceEvent> Subscribe(
    [EnumeratorCancellation] CancellationToken ct)
  {
    var ch = Channel.CreateUnbounded<DeviceEvent>(new UnboundedChannelOptions { SingleReader = true, SingleWriter = false });
    var id = Guid.NewGuid();
    _subs[id] = ch;
    try
    {
      while (await ch.Reader.WaitToReadAsync(ct))
      while (ch.Reader.TryRead(out var evt))
        yield return evt;
    }
    finally
    {
      _subs.TryRemove(id, out _);
    }
  }
}

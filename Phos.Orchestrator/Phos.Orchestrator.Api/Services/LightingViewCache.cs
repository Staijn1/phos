using Microsoft.Extensions.Options;
using Phos.Orchestrator.Core.Config;

namespace Phos.Orchestrator.Api.Services
{
  /// <summary>
  /// Exposes the current immutable <see cref="LightingView"/> and rebuilds it when the bound config changes.
  /// </summary>
  public interface ILightingViewProvider
  {
    LightingView Current { get; }
  }

  /// <summary>
  /// Monitors "Lighting" config for changes, validates, and rebuilds <see cref="LightingView"/>.
  /// </summary>
  public sealed class LightingViewCache : ILightingViewProvider, IDisposable
  {
    private readonly IOptionsMonitor<LightingConfig> _optionsMonitor;
    private readonly ILightingConfigValidator _validator;
    private readonly LightingViewBuilder _builder;
    private readonly ILogger<LightingViewCache> _logger;
    private readonly IDisposable _reloader;

    private volatile LightingView _current;

    public LightingView Current => _current;

    public LightingViewCache(
      IOptionsMonitor<LightingConfig> optionsMonitor,
      ILightingConfigValidator validator,
      LightingViewBuilder builder,
      ILogger<LightingViewCache> logger)
    {
      _optionsMonitor = optionsMonitor;
      _validator = validator;
      _builder = builder;
      _logger = logger;

      _current = BuildOrThrow(_optionsMonitor.CurrentValue);

      _reloader = _optionsMonitor.OnChange(cfg =>
      {
        try
        {
          _current = BuildOrThrow(cfg);
          _logger.LogInformation("Lighting configuration reloaded.");
        }
        catch (Exception ex)
        {
          _logger.LogError(ex, "Lighting configuration reload failed.");
        }
      });
    }

    private LightingView BuildOrThrow(LightingConfig cfg)
    {
      var res = _validator.Validate(cfg);
      if (!res.Ok)
      {
        throw new OptionsValidationException("Lighting", typeof(LightingConfig), res.Errors);
      }
      if (res.Warnings.Count > 0)
      {
        _logger.LogWarning("Lighting config warnings: {Warnings}", string.Join("; ", res.Warnings));
      }
      return _builder.Build(cfg);
    }

    public void Dispose()
    {
      _reloader.Dispose();
    }
  }
}

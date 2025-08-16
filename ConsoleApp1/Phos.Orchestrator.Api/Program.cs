using System.Threading.Channels;
using Phos.Orchestrator.Api.Controllers;
using Phos.Orchestrator.Api.Services;
using Phos.Orchestrator.Core;
using Serilog;

namespace Phos.Orchestrator.Api;

public class Program
{
  public static void Main(string[] args)
  {
    var builder = WebApplication.CreateBuilder(args);

    // Serilog: load sinks/settings from appsettings.json
    builder.Host.UseSerilog((ctx, services, log) =>
      log.ReadFrom.Configuration(ctx.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    // MVC + Swagger
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Core services
    builder.Services.AddSingleton<IDeviceRegistry, InMemoryRegistry>();
    builder.Services.AddSingleton<IDeviceEventBus, InMemoryEventBus>();

    // Shared probe queue (mDNS -> HTTP probe)
    builder.Services.AddSingleton(Channel
      .CreateUnbounded<(string ip, int port, IReadOnlyDictionary<string, string> txt)>());

    // HTTP prober (short timeouts)
    builder.Services.AddHttpClient<IDeviceProber, WledProber>(c => { c.Timeout = TimeSpan.FromSeconds(2); });

    // Background services
    builder.Services.AddHostedService<MdnsBrowser>();
    builder.Services.AddHostedService<ProbeScheduler>();

    var app = builder.Build();

    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
      app.UseSwagger();
      app.UseSwaggerUI();
    }

    // Optional; keep only if you’ve set up HTTPS certs
    app.UseHttpsRedirection();

    app.UseRouting();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
  }
}

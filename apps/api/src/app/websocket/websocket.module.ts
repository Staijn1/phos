import {Module} from "@nestjs/common";
import {WebsocketGateway} from "./websocket.gateway";
import {WebsocketClientsManagerService} from "./websocket-clients-manager.service";
import {ConfigurationModule} from "../configuration/configuration.module";
import {GradientsModule} from "../gradients/gradients.module";
import {PresetsModule} from "../presets/presets.module";

@Module({
  imports: [ConfigurationModule, GradientsModule, PresetsModule],
  providers: [WebsocketGateway, WebsocketClientsManagerService],
  exports: [WebsocketGateway]
})
export class WebsocketModule {
}

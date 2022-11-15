import {Module} from "@nestjs/common";
import {WebsocketGateway} from "./websocket.gateway";
import {WebsocketClientsManagerService} from "./websocket-clients-manager.service";

@Module({
  providers: [WebsocketGateway, WebsocketClientsManagerService],
  exports: [WebsocketGateway]
})
export class WebsocketModule {
}

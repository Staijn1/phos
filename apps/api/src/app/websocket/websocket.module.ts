import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketClientsManagerService } from './websocket-clients-manager.service';
import { ConfigurationModule } from '../configuration/configuration.module';
import {DeviceModule} from '../device/device.module';

@Module({
  imports: [ConfigurationModule, DeviceModule],
  providers: [WebsocketGateway, WebsocketClientsManagerService],
  exports: [WebsocketGateway]
})
export class WebsocketModule {
}

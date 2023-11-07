import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { ConfigurationModule } from '../configuration/configuration.module';
import {DeviceModule} from '../device/device.module';

@Module({
  imports: [ConfigurationModule, DeviceModule],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketGateway]
})
export class WebsocketModule {
}

import {Module} from '@nestjs/common';
import {WebsocketGateway} from './websocket.gateway';
import {WebsocketClientsManagerService} from './websocket-clients-manager.service';
import {ConfigurationModule} from '../configuration/configuration.module';
import {DatabaseModule} from '../database/database.module';
import {GradientsModule} from '../gradients/gradients.module';

@Module({
  imports: [ConfigurationModule, DatabaseModule, GradientsModule],
  providers: [WebsocketGateway, WebsocketClientsManagerService],
  exports: [WebsocketGateway]
})
export class WebsocketModule {
}

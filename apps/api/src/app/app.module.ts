import {Module} from '@nestjs/common';
import {WebsocketModule} from './websocket/websocket.module';
import {ConfigModule} from '@nestjs/config';
import {constructEnvironmentConfiguration} from '../environments/EnvironmentConfig';

import {validateEnvironmentConfiguration} from '../environments/EnvironmentValidation';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    WebsocketModule,
    ConfigModule.forRoot({
      load: [constructEnvironmentConfiguration],
      isGlobal: true,
      cache: true,
      validate: validateEnvironmentConfiguration,
    }),
    // TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService })
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}

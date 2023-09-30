import { Module } from '@nestjs/common';
import { GradientsService } from './gradients.service';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  providers: [GradientsService],
  imports: [ConfigurationModule],
  exports: [GradientsService]
})
export class GradientsModule {
}

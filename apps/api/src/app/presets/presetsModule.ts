import {Module} from '@nestjs/common';
import {PresetsService} from './presets.service';
import {ConfigurationModule} from '../configuration/configuration.module';

@Module({
  providers: [PresetsService],
  imports: [ConfigurationModule],
  exports: [PresetsService]
})
export class PresetsModule {
}

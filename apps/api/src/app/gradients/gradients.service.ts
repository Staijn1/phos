import { Injectable } from '@nestjs/common';
import { ConfigurationService } from '../configuration/configuration.service';
import { GradientInformation } from '@angulon/interfaces';

@Injectable()
export class GradientsService {
  constructor(private readonly configurationService: ConfigurationService) {
  }

  /**
   * Get the configured gradients from the configuration file.
   * @returns {Promise<GradientInformation[]>}
   */
  getGradients(): Promise<GradientInformation[]> {
    return this.configurationService.getGradients();
  }
}

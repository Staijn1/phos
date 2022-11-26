import {Injectable} from '@nestjs/common';
import {ConfigurationService} from '../configuration/configuration.service';

@Injectable()
export class GradientsService {
  constructor(private readonly configurationService: ConfigurationService) {
  }

  async deleteGradient(payload: { id: number }) {
    const gradients = await this.configurationService.getGradients();
    return this.configurationService.writeGradients(gradients.filter((gradient) => gradient.id !== payload.id));
  }
}

import {Injectable} from '@nestjs/common';
import {ConfigurationService} from '../configuration/configuration.service';
import {LoremIpsum} from 'lorem-ipsum';
import {AddGradientResponse, GradientInformation} from '@angulon/interfaces';

@Injectable()
export class GradientsService {
  constructor(private readonly configurationService: ConfigurationService) {
  }

  async deleteGradient(payload: { id: number }) {
    const gradients = await this.configurationService.getGradients();
    return this.configurationService.writeGradients(gradients.filter((gradient) => gradient.id !== payload.id));
  }

  async addGradient(): Promise<AddGradientResponse> {
    const loremIpsumName = new LoremIpsum().generateWords(1)
    const newGradient: GradientInformation = {
      id: Math.floor(Math.random() * 1000),
      name: loremIpsumName,
      dir: 'h',
      colorStops: [
        {pos: 0, color: '#fff'},
        {pos: 1, color: '#ff0000'},
      ],
      bgColor: '#000',
    }

    const gradients = await this.configurationService.getGradients();
    gradients.push(newGradient)

    await this.configurationService.writeGradients(gradients);
    return {gradients: gradients, gradient: newGradient}
  }
}

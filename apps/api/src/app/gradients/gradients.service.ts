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

  /**
   * Generate a new random with a random name based on LoremIpsum.
   * The gradient also has two colors with random values.
   * @returns {Promise<AddGradientResponse>}
   */
  async addGradient(): Promise<AddGradientResponse> {
    const loremIpsumName = new LoremIpsum().generateWords(1)
    const generateRandomHexColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
    const gradients = await this.configurationService.getGradients();

    const newGradient: GradientInformation = {
      // The highest gradient id + 1
      id: gradients.map((gradient) => gradient.id).reduce((a, b) => Math.max(a, b), 0) + 1,
      name: loremIpsumName,
      dir: 'h',
      colorStops: [
        {pos: 0, color: generateRandomHexColor()},
        {pos: 1, color: generateRandomHexColor()},
      ],
      bgColor: generateRandomHexColor(),
    }

    gradients.push(newGradient)

    await this.configurationService.writeGradients(gradients);
    return {gradients: gradients, gradient: newGradient}
  }
}

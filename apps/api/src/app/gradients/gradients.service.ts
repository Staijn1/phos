import {Injectable} from '@nestjs/common';
import {ConfigurationService} from '../configuration/configuration.service';
import {LoremIpsum} from 'lorem-ipsum';
import {AddGradientResponse, GradientInformation} from '@angulon/interfaces';

@Injectable()
export class GradientsService {
  constructor(private readonly configurationService: ConfigurationService) {
  }

  /**
   * Get all gradients from the configuration file, filter the gradient with the given id out and write the remaining gradients to the configuration file.
   * @param {{id: number}} payload
   * @returns {Promise<void>}
   */
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

  /**
   * Get the configured gradients from the configuration file.
   * todo: move reading and parsing of the file to this function. The configuration service should only be used to read and write a set of files
   * @returns {Promise<GradientInformation[]>}
   */
  getGradients() {
    return this.configurationService.getGradients();
  }

  async editGradient(payload: GradientInformation) {
    const gradients = await this.getGradients();
    const gradientIndex = gradients.findIndex((gradient) => gradient.id === payload.id);
    gradients[gradientIndex] = payload;
    return this.configurationService.writeGradients(gradients);
  }
}

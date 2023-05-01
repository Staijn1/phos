import {Injectable} from '@nestjs/common';
import {ConfigurationService} from '../configuration/configuration.service';
import {LoremIpsum} from 'lorem-ipsum';
import {LedstripPreset} from '@angulon/interfaces';

@Injectable()
export class PresetsService {
  constructor(private readonly configurationService: ConfigurationService) {
  }

  /**
   * Generates a random string representing a hex color, prefixed with a hash.
   * @private
   */
  private generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  /**
   * Get all presets from the configuration file.
   * @returns {Promise<LedstripPreset[]>}
   */
  getPresets(): Promise<LedstripPreset[]> {
    return this.configurationService.getPresets();
  }

  async addPreset(): Promise<LedstripPreset[]> {
    const loremIpsumName = new LoremIpsum().generateWords(1)
    const gradients = await this.getPresets();

    const newGradient: LedstripPreset = {
      brightness: 255, name: loremIpsumName, segments: [
        {
          options: 0,
          mode: 0,
          speed: 1000,
          start: 0,
          stop: 1,
          colors: [
            this.generateRandomColor(),
            this.generateRandomColor(),
            this.generateRandomColor(),
          ]
        }
      ]
    }

    gradients.push(newGradient)

    await this.configurationService.writePresets(gradients);
    return gradients;
  }
}

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

  /**
   * Delete a preset from the configuration file
   */
  async deletePreset(index: number): Promise<LedstripPreset[]> {
    const gradients = await this.getPresets();
    gradients.splice(index, 1);

    await this.configurationService.writePresets(gradients);
    return gradients;
  }

  /**
   * Update an existing preset in the configuration file.
   */
  async updatePreset(index: number, newPresetInformation: LedstripPreset): Promise<LedstripPreset[]> {
    const gradients = await this.getPresets();
    gradients[index] = newPresetInformation;

    await this.configurationService.writePresets(gradients);
    return gradients;
  }

  /**
   * Add a new preset to the configuration file.
   */
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

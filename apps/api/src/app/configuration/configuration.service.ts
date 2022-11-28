import {Injectable} from '@nestjs/common';
import {GradientInformation, ModeInformation} from '@angulon/interfaces';
import * as fs from 'fs';
import path = require('path');

@Injectable()
export class ConfigurationService {
  private readonly assetPath: string;

  constructor() {
    this.assetPath = path.join(__filename, '../assets');
  }

  /**
   * Read the modes.json file in the assets folder
   * @returns {Promise<ModeInformation[]>}
   */
  async getModes(): Promise<ModeInformation[]> {
    const contents = await fs.promises.readFile(path.join(this.assetPath, 'modes.json'));
    return JSON.parse(contents.toString());
  }

  /**
   * Read the gradients.json file in the assets folder
   * @deprecated - Should be replaced with the getGradients() method in the GradientsService
   * @returns {Promise<GradientInformation[]>}
   */
  async getGradients(): Promise<GradientInformation[]> {
    const contents = await fs.promises.readFile(path.join(this.assetPath, 'gradients.json'));
    return JSON.parse(contents.toString());
  }

  /**
   * Write the array of gradients to the gradients.json file in the assets folder
   * @param {GradientInformation[]} gradients
   * @returns {Promise<void>}
   */
  async writeGradients(gradients: GradientInformation[]): Promise<void> {
    await fs.promises.writeFile(path.join(this.assetPath, 'gradients.json'), JSON.stringify(gradients, null, 2));
  }
}

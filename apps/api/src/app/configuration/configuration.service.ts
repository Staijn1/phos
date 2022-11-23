import {Injectable} from '@nestjs/common';
import {GradientInformation, ModeInformation} from '@angulon/interfaces';
import path = require('path');
import * as fs from 'fs';
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
   * @returns {Promise<GradientInformation[]>}
   */
  async getGradients(): Promise<GradientInformation[]> {
    const contents = await fs.promises.readFile(path.join(this.assetPath, 'gradients.json'));
    return JSON.parse(contents.toString());
  }
}

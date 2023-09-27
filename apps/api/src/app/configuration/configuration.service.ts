import { Injectable, Logger } from "@nestjs/common";
import { GradientInformation, ModeInformation } from "@angulon/interfaces";
import * as fs from "fs";
import path = require("path");

@Injectable()
export class ConfigurationService {
  private readonly rootAssetsPath: string;
  private readonly configPath: string;
  private readonly logger: Logger = new Logger("ConfigurationService");

  constructor() {
    this.rootAssetsPath = path.join(__filename, "../assets");
    this.configPath = path.join(this.rootAssetsPath, "config");
    this.writeDefaults().then();
  }

  /**
   * Read the modes.json file in the assets folder
   * @returns {Promise<ModeInformation[]>}
   */
  async getModes(): Promise<ModeInformation[]> {
    const contents = await fs.promises.readFile(path.join(this.configPath, "modes.json"));
    return JSON.parse(contents.toString());
  }

  /**
   * Read the gradients.json file in the assets folder
   * @returns {Promise<GradientInformation[]>}
   */
  async getGradients(): Promise<GradientInformation[]> {
    const contents = await fs.promises.readFile(path.join(this.configPath, "gradients.json"));
    return JSON.parse(contents.toString());
  }

  /**
   * Write the array of gradients to the gradients.json file in the assets folder
   * @param {GradientInformation[]} gradients
   * @returns {Promise<void>}
   */
  async writeGradients(gradients: GradientInformation[]): Promise<void> {
    await fs.promises.writeFile(path.join(this.configPath, "gradients.json"), JSON.stringify(gradients, null, 2));
  }

  /**
   * For each file in assetpath/defaults, check if the file exists in assetpath
   * If not, write that file to the assetpath
   * Also check if the config folder exists, if not, create it
   * @private
   */
  private async writeDefaults(): Promise<void> {
    const defaultsPath = path.join(this.rootAssetsPath, "defaults");
    const defaultFiles = await fs.promises.readdir(defaultsPath);

    // Check if config folder exists
    try {
      await fs.promises.access(this.configPath, fs.constants.F_OK);
    } catch (err) {
      // If not, create it
      await fs.promises.mkdir(this.configPath);
    }

    for (const file of defaultFiles) {
      const defaultFilePath = path.join(defaultsPath, file);
      const assetFilePath = path.join(this.configPath, file);

      try {
        // Check if the file exists in the asset path
        await fs.promises.access(assetFilePath, fs.constants.F_OK);
      } catch (err) {
        // If the file does not exist, write it to the asset path
        this.logger.log(`Writing defaults for file ${file}`);
        const contents = await fs.promises.readFile(defaultFilePath);
        await fs.promises.writeFile(assetFilePath, contents);
      }
    }
  }
}


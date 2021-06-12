import { ModeInformation } from '../../Types/ModeInformation'
import * as fs from 'fs'
import path from 'path'
import { GradientInformation } from '../../Types/GradientInformation'

/**
 * A class that has access to information retrieved from assets
 */
export class InformationService {
  readonly assetsPath = path.join(__dirname, '..', '..', 'Assets')

  /**
   * Write an object or array to a file
   * @param {string} file
   * @param {any} content
   * @return {Promise<void>}
   * @private
   */
  private async writeJSON(file: string, content: any): Promise<void> {
    return fs.promises.writeFile(
      path.join(this.assetsPath, file),
      JSON.stringify(content),
      'utf-8'
    )
  }

  /**
   * Read a file with a certain filename in the assets folder
   * @param {string} file
   * @return {Promise<string>}
   * @async
   */
  async readJSON(file: string): Promise<string> {
    return fs.promises.readFile(path.join(this.assetsPath, file), 'utf-8')
  }

  /**
   * Get all modes saved in assets
   * @return {Promise<ModeInformation[]>}
   * @async
   */
  async getModes(): Promise<ModeInformation[]> {
    const modes = await this.readJSON('modes.json')
    return JSON.parse(modes)
  }

  /**
   * Read all gradients present for the visualizerPage
   */
  async getVisualizerGradients(): Promise<GradientInformation[]> {
    const gradientsJSONRaw = await this.readJSON('gradients.json')
    const gradients = JSON.parse(gradientsJSONRaw) as GradientInformation[]
    return gradients.sort((a: GradientInformation, b: GradientInformation) =>
      a.name > b.name ? 1 : -1
    )
  }

  /**
   * Read all visualizerPage modes present for the visualizerPage
   */
  async getVisualizerModes(): Promise<ModeInformation[]> {
    const modes = await this.readJSON('visualizermodes.json')
    return JSON.parse(modes)
  }

  /**
   * Edit a gradient with name x. Replace it with the given gradient
   * @param {number}id
   * @param {GradientInformation} gradient
   * @return {Promise<void>}
   */
  async editVisualizerGradient(
    id: number,
    gradient: GradientInformation
  ): Promise<GradientInformation[]> {
    const gradientsJSON = await this.readJSON('gradients.json')
    const gradients = JSON.parse(gradientsJSON) as GradientInformation[]

    const gradientIndex = gradients.findIndex((value) => {
      return value.id === id
    })

    gradients[gradientIndex] = gradient

    await this.writeJSON('gradients.json', gradients)
    return this.getVisualizerGradients()
  }

  /**
   * Remove a gradient with name x.
   * @return {Promise<GradientInformation[]>}
   * @param {number}id
   */
  async removeVisualizerGradient(id: number): Promise<GradientInformation[]> {
    const gradientsJSON = await this.readJSON('gradients.json')
    const gradients = JSON.parse(gradientsJSON) as GradientInformation[]

    const gradientIndex = gradients.findIndex((value) => {
      return value.id === id
    })

    gradients.splice(gradientIndex, 1)

    await this.writeJSON('gradients.json', gradients)

    return this.getVisualizerGradients()
  }

  /**
   * Create a gradient
   * @param {GradientInformation} content
   * @return {Promise<void>}
   */
  async addVisualizerGradient(
    content: GradientInformation
  ): Promise<GradientInformation[]> {
    const gradientsJSON = await this.readJSON('gradients.json')
    const gradients = JSON.parse(gradientsJSON) as GradientInformation[]

    const highestIDCurrently = Math.max(...gradients.map((o) => o.id))
    content.id = highestIDCurrently >= 0 ? highestIDCurrently + 1 : 0

    gradients.push(content)

    await this.writeJSON('gradients.json', gradients)
    return this.getVisualizerGradients()
  }
}

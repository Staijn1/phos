import {Injectable} from '@angular/core'
import {Connection} from '../../shared/interfaces/Connection'
import {WebsocketService} from '../websocketconnection/websocket.service'
import {HTTPConnectionService} from '../httpconnection/httpconnection.service'
import {ModeInformation} from '../../shared/types/ModeInformation'
import {GradientInformation, GradientInformationExtended} from '../../shared/types/GradientInformation'
import iro from '@jaames/iro'
import {ErrorService} from '../error/error.service'
import {gradientList} from '../../data/gradients';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService extends Connection {

  constructor(
    private websocketService: WebsocketService,
    private apiService: HTTPConnectionService,
    private errorService: ErrorService) {
    super()
  }

  decreaseBrightness(): void {
    try {
      this.apiService.decreaseBrightness()
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  decreaseSpeed(): void {
    try {
      this.apiService.decreaseSpeed()
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  increaseBrightness(): void {
    try {
      this.apiService.increaseBrightness()
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  increaseSpeed(): void {
    try {
      this.apiService.increaseSpeed()
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  protected send(command: string): void {
    throw Error('Not implemented')
  }

  setColor(colors: iro.Color[] | string[]): void {
    try {
      this.websocketService.setColor(colors)
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  /**
   * Sends data to show on visualizer mode
   * @param {number} amount - Integer ranging from 0 - 255
   */
  setLeds(amount: number): void {
    try {
      this.websocketService.setLeds(amount)
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  /**
   * Set the ledstrip to a certain mode
   * @param {number} mode - The ID of the mode to select
   */
  setMode(mode: number): void {
    try {
      this.apiService.setMode(mode)
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  /**
   * Retrieve all the different modes from the server
   * @return {Promise<ModeInformation[]>}
   */
  async getModes(): Promise<ModeInformation[]> {
    try {
      return await this.apiService.getModes()
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  /**
   * Retrieve all the different gradients from the server. Gradients are used in the audiomotion visualizer
   * @return {Promise<GradientInformation[]>}
   */
  async getGradients(): Promise<GradientInformation[]> {
    try {
      return Promise.resolve(gradientList as GradientInformation[])
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  /**
   * Edit a gradient
   * @param {GradientInformationExtended} gradient - The gradient to edit with its new values
   * @return {Promise<void>}
   */
  async editGradient(gradient: GradientInformationExtended): Promise<void> {
    try {
      await this.apiService.editGradient(gradient)
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  /***
   * Delete a gradient
   * @param {GradientInformationExtended} gradient
   * @return {Promise<GradientInformation[]>}
   */
  async removeGradient(gradient: GradientInformationExtended): Promise<GradientInformation[]> {
    try {
      return await this.apiService.removeGradient(gradient)
    } catch (error) {
     this.errorService.setError(error)
    }
  }

  /**
   * Create a new gradient
   * @param {GradientInformationExtended} newGradient
   * @return {Promise<GradientInformation[]>}
   */
  async addGradient(newGradient: GradientInformationExtended): Promise<GradientInformation[]> {
    try {
      return await this.apiService.addGradient(newGradient)
    } catch (error) {
     this.errorService.setError(error)
    }
  }
}

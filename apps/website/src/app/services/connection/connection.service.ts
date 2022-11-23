import {Injectable} from '@angular/core'
import {Connection} from '../../shared/interfaces/Connection'
import {WebsocketService} from '../websocketconnection/websocket.service'
import {HTTPConnectionService} from '../httpconnection/httpconnection.service'
import iro from '@jaames/iro'
import {ErrorService} from '../error/error.service'
import {GradientInformation, GradientInformationExtended, ModeInformation} from '@angulon/interfaces';

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
    } catch (error: any) {
      this.errorService.setError(error)
    }
  }

  decreaseSpeed(): void {
    try {
      this.apiService.decreaseSpeed()
    } catch (error: any) {
      this.errorService.setError(error)
    }
  }

  increaseBrightness(): void {
    try {
      this.apiService.increaseBrightness()
    } catch (error: any) {
      this.errorService.setError(error)
    }
  }

  increaseSpeed(): void {
    try {
      this.apiService.increaseSpeed()
    } catch (error: any) {
      this.errorService.setError(error)
    }
  }

  protected send(command: string): void {
    throw Error('Not implemented')
  }

  setColor(colors: iro.Color[] | string[]): void {
    try {
      this.websocketService.setColor(colors)
    } catch (error: any) {
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
    } catch (error: any) {
      this.errorService.setError(error)
    }
  }

  /**
   * Set the ledstrip to a certain mode
   * @param {number} mode - The ID of the mode to select
   */
  setMode(mode: number): void {
    try {
      this.websocketService.setMode(mode)
    } catch (error: any) {
      this.errorService.setError(error)
    }
  }

  /**
   * Retrieve all the different modes from the server
   * @return {Promise<ModeInformation[]>}
   */
  async getModes(): Promise<ModeInformation[]> {
    return this.websocketService.getModes();
  }

  /**
   * Retrieve all the different gradients from the server. Gradients are used in the audiomotion visualizer
   * @return {Promise<GradientInformation[]>}
   */
  async getGradients(): Promise<GradientInformation[]> {
    try {
      return this.websocketService.getGradients();
    } catch (error: any) {
      this.errorService.setError(error)
      return []
    }
  }

  /**
   * Edit a gradient
   * @param {GradientInformationExtended} gradient - The gradient to edit with its new values
   * @return {Promise<void>}
   */
  async editGradient(gradient: GradientInformationExtended): Promise<void> {
    try {
      await this.apiService.editGradient(gradient as GradientInformation)
    } catch (error: any) {
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
      return await this.apiService.removeGradient(gradient as GradientInformation)
    } catch (error: any) {
      this.errorService.setError(error)
      return this.getGradients()
    }
  }

  /**
   * Create a new gradient
   * @param {GradientInformationExtended} newGradient
   * @return {Promise<GradientInformation[]>}
   */
  async addGradient(newGradient: GradientInformationExtended): Promise<GradientInformation[]> {
    try {
      return await this.apiService.addGradient(newGradient as GradientInformation)
    } catch (error: any) {
      this.errorService.setError(error)
      return this.getGradients();
    }
  }
}

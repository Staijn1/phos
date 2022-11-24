import {Injectable} from '@angular/core'
import {LedstripConnection} from '../../shared/interfaces/LedstripConnection'
import {WebsocketService} from '../websocketconnection/websocket.service'
import {InformationService} from '../information-service/information.service'
import iro from '@jaames/iro'
import {MessageService} from '../error/message.service'
import {GradientInformation, GradientInformationExtended, ModeInformation} from '@angulon/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LedstripCommandService extends LedstripConnection {

  constructor(
    private websocketService: WebsocketService,
    private errorService: MessageService) {
    super()
  }

  decreaseBrightness(): void {
    try {
      this.websocketService.decreaseBrightness()
    } catch (error: any) {
      this.errorService.setMessage(error)
    }
  }

  decreaseSpeed(): void {
    try {
      this.websocketService.decreaseSpeed()
    } catch (error: any) {
      this.errorService.setMessage(error)
    }
  }

  increaseBrightness(): void {
    try {
      this.websocketService.increaseBrightness()
    } catch (error: any) {
      this.errorService.setMessage(error)
    }
  }

  increaseSpeed(): void {
    try {
      this.websocketService.increaseSpeed()
    } catch (error: any) {
      this.errorService.setMessage(error)
    }
  }

  setColor(colors: iro.Color[] | string[]): void {
    try {
      this.websocketService.setColor(colors)
    } catch (error: any) {
      this.errorService.setMessage(error)
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
      this.errorService.setMessage(error)
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
      this.errorService.setMessage(error)
    }
  }

  /**
   * Retrieve all the different modes from the server
   * @return {Promise<ModeInformation[]>}
   */
  async getModes(): Promise<ModeInformation[]> {
    return this.websocketService.getModes();
  }
}

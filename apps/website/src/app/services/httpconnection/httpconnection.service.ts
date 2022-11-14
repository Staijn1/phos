import {Injectable} from '@angular/core'
import {Connection} from '../../shared/interfaces/Connection'
import iro from '@jaames/iro'
import {environment} from '../../../environments/environment'
import {ErrorService} from '../error/error.service'
import {GradientInformation, ModeInformation} from "@angulon/interfaces";

@Injectable({
  providedIn: 'root',
})
export class HTTPConnectionService extends Connection {
  readonly url = environment.url;
  private brightness!: number;
  private speed!: number;

  constructor(errorService: ErrorService) {
    super()
    Promise.all([this.getBrightness(), this.getSpeed()]).then().catch(e => errorService.setError(e))
  }

  private async getBrightness(): Promise<void> {
    const response = await fetch(`${this.url}/status`, {
      method: 'GET'
    })
    this.handleError(response)
    const data = await response.json()
    this.brightness = data.brightness
  }

  private async setBrightness(newBrightness: number): Promise<void> {
    const response = await fetch(`${this.url}/set_brightness?absolute=${newBrightness}`)
    this.handleError(response)
    const data = await response.json()
    this.brightness = data.brightness
  }

  decreaseBrightness(): void {
    this.setBrightness(Math.round(this.brightness * 0.90)).then()
  }

  private async getSpeed(): Promise<void> {
    const response = await fetch(`${this.url}/status`, {
      method: 'GET'
    })
    this.handleError(response)
    const data = await response.json()
    this.speed = data.speed
  }

  private async setSpeed(newSpeed: number): Promise<void> {
    const response = await fetch(`${this.url}/set_speed?s=${newSpeed}`)

    this.handleError(response)
    const data = await response.json()
    this.speed = data.speed
  }

  decreaseSpeed(): void {
    this.setSpeed(Math.round(this.speed * 1.1)).then()
  }

  increaseBrightness(): void {
    this.setBrightness(Math.round(this.brightness * 1.1)).then()
  }

  increaseSpeed(): void {
    this.setSpeed(Math.round(this.speed * 0.9)).then()
  }

  protected send(command: string): void {
    throw Error('Not implemented')
  }

  setColor(colors: iro.Color[] | string[]): void {
    throw Error('Not implemented')
  }

  setLeds(amount: number): void {
    throw new Error('Not implemented')
  }

  setMode(mode: number): void {
    fetch(`${this.url}/set_mode?m=${mode}`).then(response => {
      this.handleError(response)
    })
  }

  async getModes(): Promise<ModeInformation[]> {
    const response = await fetch(`${this.url}/get_modes`, {
      method: 'GET',
    })
    this.handleError(response)
    return response.json()
  }

  async getGradients(): Promise<GradientInformation[]> {
    const response = await fetch(`${this.url}/visualizer/gradients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.handleError(response)
    return response.json()
  }

  async editGradient(gradient: GradientInformation) {
    const response = await fetch(`${this.url}/visualizer/gradients/${gradient.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gradient),
    })

    this.handleError(response)
    return response.json()
  }

  async removeGradient(gradient: GradientInformation) {
    const response = await fetch(`${this.url}/visualizer/gradients/${gradient.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    this.handleError(response)
    return response.json()
  }

  async addGradient(newGradient: GradientInformation): Promise<GradientInformation[]> {
    const response = await fetch(`${this.url}/visualizer/gradients/`, {
      method: 'POST',
      body: JSON.stringify(newGradient),
      headers: {
        'Content-Type': 'application/json',
      }
    })

    this.handleError(response)
    return response.json()
  }

  private handleError(response: Response): void {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
  }
}

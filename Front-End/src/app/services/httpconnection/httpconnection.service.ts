import {Injectable} from '@angular/core'
import {Connection} from '../../shared/interfaces/Connection'
import {ModeInformation} from '../../shared/types/ModeInformation'
import {GradientInformation} from '../../shared/types/GradientInformation'
import iro from '@jaames/iro'
import {environment} from '../../../environments/environment'
import {map} from '../../shared/functions'

@Injectable({
  providedIn: 'root',
})
export class HTTPConnectionService extends Connection {
  readonly url = `http://${environment.ledstrip}`
  private brightness: number;
  private speed: number;

  constructor() {
    super()
    Promise.all([this.getBrightness(), this.getSpeed()]).then()
  }

  private async getBrightness(): Promise<void> {
    const response = await fetch(`${this.url}/get_brightness`, {
      method: 'GET'
    })
    this.handleError(response)
    const data = await response.text()
    this.brightness = map(parseInt(data), 0, 100, 0, 255)
  }

  private async setBrightness(newBrightness: number): Promise<void> {
    const response = await fetch(`${this.url}/set_brightness?p=${newBrightness}`, {
      method: 'GET'
    })
    this.handleError(response)
    const data = await response.json()
    this.brightness = data.brightness
  }

  decreaseBrightness(): void {
    this.setBrightness(this.brightness - 10).then()
  }

  private async getSpeed(): Promise<void> {
    const response = await fetch(`${this.url}/get_speed`, {
      method: 'GET'
    })
    this.handleError(response)
    const data = await response.text()
    this.speed = map(parseInt(data), 0, 100, 0, 255)
  }

  private async setSpeed(newSpeed: number): Promise<void> {
    const response = await fetch(`${this.url}/set_speed?p=${newSpeed}`, {
      method: 'GET'
    })
    this.handleError(response)
    const data = await response.json()
    this.speed = data.speed
  }

  decreaseSpeed(): void {
    this.setSpeed(this.speed - 10).then()
  }

  increaseBrightness(): void {
    this.setBrightness(this.brightness + 10).then()
  }

  increaseSpeed(): void {
    this.setSpeed(this.speed + 10).then()
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
    fetch(`${this.url}/set_mode?m=${mode}`, {
      method: 'GET',
    }).then(response => {
      this.handleError(response)
    })
  }

  private handleError(response: Response): void {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
  }

  async getModes(): Promise<ModeInformation[]> {
    const response = await fetch(`http://192.168.178.80/get_modes`, {
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
}

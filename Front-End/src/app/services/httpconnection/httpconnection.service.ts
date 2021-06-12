import { Injectable } from '@angular/core'
import { Connection } from '../../shared/interfaces/Connection'
import { environment } from '../../../environments/environment'
import { ModeInformation } from '../../shared/types/ModeInformation'
import { GradientInformation } from '../../shared/types/GradientInformation'
import iro from '@jaames/iro'

@Injectable({
  providedIn: 'root',
})
export class HTTPConnectionService extends Connection {
  readonly url = environment.url

  constructor() {
    super()
  }

  decreaseBrightness(): void {
    fetch(`${this.url}/brightness/decrease`, {
      method: 'POST',
    }).then(response => this.handleError(response))
  }

  decreaseSpeed(): void {
    fetch(`${this.url}/speed/decrease`, {
      method: 'POST',
    }).then(response => this.handleError(response))
  }

  increaseBrightness(): void {
    fetch(`${this.url}/brightness/increase`, {
      method: 'POST',
    }).then(response => this.handleError(response))
  }

  increaseSpeed(): void {
    fetch(`${this.url}/speed/increase`, {
      method: 'POST',
    }).then(response => {
      this.handleError(response)
    })
  }

  protected send(command: string): void {
    throw Error('Not implemented')
  }

  setColor(colors: iro.Color[] | string[]): void {
    const formattedColors = []
    for (const color of colors) {
      let colorstring: string
      if (typeof color === 'object') {
        colorstring = color.hexString
      } else {
        colorstring = color
      }

      formattedColors.push(colorstring.substring(1, colorstring.length))
    }
    fetch(`${this.url}/color`, {
      method: 'POST',
      body: JSON.stringify({ color: formattedColors }),
      headers: { 'Content-Type': 'application/json' },
    }).then(response => this.handleError(response))
  }

  setLeds(amount: number): void {
    throw new Error('Not implemented')
  }

  setMode(mode: number): void {
    fetch(`${this.url}/mode`, {
      method: 'POST',
      body: JSON.stringify(mode),
      headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${this.url}/mode`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

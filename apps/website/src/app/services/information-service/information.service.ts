import {Injectable} from '@angular/core'
import {GradientInformation} from "@angulon/interfaces";
import {MessageService} from "../error/message.service";
import {environment} from "../../../environments/environment";
import {WebsocketService} from "../websocketconnection/websocket.service";

@Injectable({
  providedIn: 'root',
})
export class InformationService {
  url = environment.url

  constructor(private readonly messageService: MessageService, private readonly websocket: WebsocketService) {
  }

  async getGradients(): Promise<GradientInformation[]> {
    return this.websocket.getGradients();
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
      this.messageService.setMessage(new Error(response.statusText))
    }
  }
}

import { Injectable } from "@angular/core";
import { AddGradientResponse, GradientInformation } from "@angulon/interfaces";
import { MessageService } from "../message-service/message.service";
import { environment } from "../../../environments/environment";
import { WebsocketService } from "../websocketconnection/websocket.service";
import Vibrant from "node-vibrant";

@Injectable({
  providedIn: "root"
})
export class InformationService {
  url = environment.url;

  constructor(private readonly messageService: MessageService, private readonly websocket: WebsocketService) {
  }

  async getGradients(): Promise<GradientInformation[]> {
    return this.websocket.getGradients();
  }

  async editGradient(gradient: GradientInformation): Promise<GradientInformation[]> {
    return this.websocket.editGradient(gradient);
  }

  async deleteGradient(gradient: GradientInformation): Promise<GradientInformation[]> {
    return this.websocket.deleteGradient(gradient.id);
  }

  /**
   * Create a new gradient. It is generated on the server.
   * The server returns the full list of gradients and the newly generated gradient.
   * @returns {Promise<{gradients: GradientInformation[], gradient: GradientInformation}[]>}
   */
  async addGradient(): Promise<AddGradientResponse> {
    return this.websocket.addGradient();
  }

  private handleError(response: Response): void {
    if (!response.ok) {
      this.messageService.setMessage(new Error(response.statusText));
    }
  }

  /**
   * From an image URL get the average colors of the image.
   * @param {string} url
   */
  async getAverageColors(url: string) {
    // Create a Vibrant object with the image URL
    const vibrant = new Vibrant(url);

    // Extract the color palette asynchronously
    const palette = await vibrant.getPalette();
    console.log(palette);

    return palette;
  }
}

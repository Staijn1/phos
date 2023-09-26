import { Injectable } from "@angular/core";
import Vibrant from "node-vibrant";
import { Palette } from "node-vibrant/lib/color";
import { FastAverageColor, FastAverageColorResult } from "fast-average-color";

@Injectable({
  providedIn: "root"
})
export class InformationService {
  /**
   * Analyze the image at the given URL and return the color palette
   * @param {string} url
   */
  async getColorsFromImageUrl(url: string): Promise<Palette & { Average: FastAverageColorResult }> {
    // Create a Vibrant object with the image URL
    const vibrant = new Vibrant(url);
    const fac = new FastAverageColor();

    // Extract the color palette asynchronously
    const palette = await vibrant.getPalette();
    const average = await fac.getColorAsync(url, {algorithm: "dominant", ignoredColor: [0, 0, 0, 255, 50]});

// Return the color palette with the result from fac
    return {...palette, Average: average} as Palette & { Average: FastAverageColorResult };
  }
}

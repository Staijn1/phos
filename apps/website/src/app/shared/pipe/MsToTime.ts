import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "msToTime",
  pure: true
})
export class MsToTimePipe implements PipeTransform {
  /**
   * Transforms milliseconds to HH:mm:ss or mm:ss if hours = 0
   * @param duration
   */
  transform(duration: number): string {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)));
    return this.format(hours, minutes, seconds);
  }

  /**
   * Format to HH:mm:ss or mm:ss if hours = 0
   * @param hours
   * @param minutes
   * @param seconds
   * @private
   */
  private format(hours: number, minutes: number, seconds: number): string {
    const formatted = `${this.pad(minutes)}:${this.pad(seconds)}`;

    if (hours === 0) return formatted;
    return `${this.pad(hours)}:${formatted}`;
  }

  /**
   * If the number does not have two digits, add a 0 in front
   * @param num
   * @private
   */
  private pad(num: number): string {
    return num < 10 ? "0" + num : num.toString();
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNo',
})
export class YesNoPipe implements PipeTransform {

  /**
   * Transform a boolean to yes or no. The text is returned capitalized.
   * @param value
   */
  transform(value: boolean): string {
    return value ? 'Yes' : 'No';
  }
}

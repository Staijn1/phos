import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'IPv6ToIPv4',
})
export class MappedIPv6ToIPv4Pipe implements PipeTransform {
  /**
   * The ip addresses from the back end sometimes contain a mapped IPv4 address.
   * This IP address was IPv4 but was mapped to IPv6, so filler letters were added.
   * This is pretty ugly and useless to the user so we remove the filler letters.
   * @param value
   */
  transform(value: string): string {
    return value.replace('::ffff:', '');
  }
}

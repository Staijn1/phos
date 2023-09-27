import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "cast",
  pure: true
})
export class CastPipe implements PipeTransform {
  transform(value: any, args?: any): Event {
    return value;
  }
}

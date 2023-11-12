import {Component, Input} from '@angular/core';
import {IDevice} from "@angulon/interfaces";

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
})
export class DeviceComponent {
  @Input() device!: IDevice;
}

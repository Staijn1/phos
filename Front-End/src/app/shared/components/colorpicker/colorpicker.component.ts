import {Component, Input, OnInit} from '@angular/core';
import iro from '@jaames/iro';
import {iroColorObject} from '../../types/types';
import {IroColorPicker} from '@jaames/iro/dist/ColorPicker';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss']
})
export class ColorpickerComponent implements OnInit {
  @Input() colorChangeEvent: (color) => void
  private picker: IroColorPicker;
  @Input() id: number = 0;

  constructor() {
  }

  ngOnInit(): void {
    console.log("ID:", this.id)
    this.picker = iro.ColorPicker(`#colorpicker${this.id}`, {
      width: 150,
      layoutDirection: 'horizontal',
      handleRadius: 6,
      borderWidth: 2,
      borderColor: '#fff',
      wheelAngle: 90,
    })
    this.picker.on('color:change', this.colorChangeEvent.bind(this))
  }

}

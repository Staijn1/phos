import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core'
import iro from '@jaames/iro'
import {IroColorPicker} from '@jaames/iro/dist/ColorPicker'
import Color = iro.Color;

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
})
export class ColorpickerComponent implements AfterViewInit {
  @Input() id: string = 'colorpicker'
  @Input() color!: string[]
  @Output() colorChange = new EventEmitter<Color>()
  private picker!: IroColorPicker

  ngAfterViewInit(): void {
    try {
      this.picker = iro.ColorPicker(`#${this.id}`, {
        width: 125,
        layoutDirection: 'horizontal',
        handleRadius: 6,
        borderWidth: 2,
        borderColor: '#fff',
        wheelAngle: 90,
        colors: this.color,
      })
      this.picker.on('color:change', (color: Color) => {
        this.colorChange.emit(color)
      })
    } catch (e) {
      console.error(`Colorpicker creation failed for ${this.id}. Reason: `, e)
    }
  }

}

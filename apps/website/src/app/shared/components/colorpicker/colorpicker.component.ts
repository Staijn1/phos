import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import iro from '@jaames/iro'
import {IroColorPicker} from '@jaames/iro/dist/ColorPicker'

export type ColorpickerEvent = {
  color: iro.Color
  colorpicker: iro.ColorPicker
}

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
})
export class ColorpickerComponent implements OnInit, AfterViewInit {
  @Input() initialColor!: string[]
  @Output() colorInit = new EventEmitter<ColorpickerEvent>()
  @Output() colorChange = new EventEmitter<ColorpickerEvent>()
  @Output() inputEnd = new EventEmitter<ColorpickerEvent>();
  id!: string;
  private picker!: IroColorPicker

  ngOnInit(): void {
    this.generateElementId();
  }

  ngAfterViewInit(): void {
    try {
      this.picker = iro.ColorPicker(`#${this.id}`, {
        width: 150,
        layoutDirection: 'horizontal',
        handleRadius: 8,
        borderWidth: 2,
        borderColor: '#fff',
        wheelAngle: 90,
        colors: this.initialColor
      })
      this.picker.on('color:init', (iroColor: iro.Color) => {
        this.colorInit.emit({color: iroColor, colorpicker: this.picker})
      })
      this.picker.on('color:change', (iroColor: iro.Color) => {
        this.colorChange.emit({color: iroColor, colorpicker: this.picker})
      })
      this.picker.on('input:end', (iroColor: iro.Color) => {
        this.inputEnd.emit({color: iroColor, colorpicker: this.picker})
      })
    } catch (e) {
      console.error(`Colorpicker creation failed for #colorpicker. Reason: `, e)
    }
  }

  /**
   * To prevent multiple colorpickers on the same page ending up with the same id, we generate a random id.
   * It therefore should be a valid html ID
   * @private
   */
  private generateElementId() {
    const array = new Uint32Array(5);
    self.crypto.getRandomValues(array);
    this.id = 'colorpicker-' + array.join('-');
  }

}

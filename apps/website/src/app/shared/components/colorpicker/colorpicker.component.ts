import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import iro from '@jaames/iro';
import { IroColorPicker } from '@jaames/iro/dist/ColorPicker';
import { Store } from '@ngrx/store';
import { ChangeLedstripColors } from '../../../../redux/ledstrip/ledstrip.action';
import { LedstripState } from '@angulon/interfaces';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss']
})
export class ColorpickerComponent implements OnInit, AfterViewInit {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  protected id = this.generateElementId();
  private picker!: IroColorPicker;
  private indexOfCurrentActiveColor = 0;
  private skipSettingColors = false;
  private colorpickerOptions: Parameters<typeof iro.ColorPicker>[1] = {
    width: 150,
    handleRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    wheelAngle: 90,
    layout: [
      {
        component: iro.ui.Wheel
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'value',
          activeIndex: 0
        }
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'value',
          activeIndex: 1
        }
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'value',
          activeIndex: 2
        }
      }
    ]
  };

  constructor(private store: Store<{ ledstripState: LedstripState | undefined }>) {
  }

  ngOnInit(): void {
    this.generateElementId();
  }

  ngAfterViewInit(): void {
    this.colorpickerOptions.layoutDirection = this.orientation;
    this.picker = iro.ColorPicker(`#${this.id}`, this.colorpickerOptions);

    this.store.select('ledstripState').subscribe((state) => {
      if (!state) return;

      if (this.skipSettingColors) {
        this.skipSettingColors = false;
        return;
      }

      this.picker.setColors(state.colors);

      // When setting the colors, the active color is reset to the first color.
      // We need to set it back to the index of the color that was active before, otherwise it jumps to the first color and drags that instead
      this.picker.setActiveColor(this.indexOfCurrentActiveColor);
    });

    this.picker.on('color:change', (color: iro.Color) => {
      this.indexOfCurrentActiveColor = color.index;
      const colors = this.picker.colors.map(c => c.hexString);
      this.skipSettingColors = true;
      this.store.dispatch(new ChangeLedstripColors(colors));
    });
  }

  changeOrientation(direction: 'horizontal' | 'vertical') {
    console.log(direction);
    this.picker.setOptions({ layoutDirection: direction });
    console.log(this.picker.props.layoutDirection);
  }

  /**
   * To prevent multiple colorpickers on the same page ending up with the same id, we generate a random id.
   * It therefore should be a valid html ID
   * @private
   */
  private generateElementId(): string {
    const array = new Uint32Array(5);
    self.crypto.getRandomValues(array);
    return 'colorpicker-' + array.join('-');
  }
}

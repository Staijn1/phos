import {AfterViewInit, Component, Input} from '@angular/core';
import iro from '@jaames/iro';
import {IroColorPicker} from '@jaames/iro/dist/ColorPicker';
import {Store} from '@ngrx/store';
import {ChangeRoomColors} from '../../../../redux/roomstate/roomstate.action';
import {ClientNetworkState} from '../../../../redux/networkstate/ClientNetworkState';
import {getStateOfSelectedRooms} from '../../functions';


export type ColorPickerOptions = Parameters<typeof iro.ColorPicker>[1];
export type ColorPickerLayoutOptions = ColorPickerOptions['layout'];


@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss']
})
export class ColorpickerComponent implements AfterViewInit {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  protected id = this.generateElementId();
  private picker!: IroColorPicker;
  private indexOfCurrentActiveColor = 0;
  private skipSettingColors = false;
  private colorpickerOptions: ColorPickerOptions = {
    width: 150,
    handleRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    wheelAngle: 0,
    layout: this.getActiveColorPickerLayout(),
  };
  isEnabled = true;

  constructor(private store: Store<{ networkState: ClientNetworkState | undefined }>) {
  }

  ngAfterViewInit(): void {
    this.colorpickerOptions.layoutDirection = this.orientation;
    this.picker = iro.ColorPicker(`#${this.id}`, this.colorpickerOptions);

    this.store.select('networkState').subscribe((state) => {
      if (!state) return;

      // Find the current state of the selected rooms by taking the first selected room
      const selectedState = getStateOfSelectedRooms(state);

      if (!selectedState) {
        this.disableColorPicker();
        return;
      }

     this.enableColorPicker();

      if (this.skipSettingColors) {
        this.skipSettingColors = false;
        return;
      }

      this.picker.setColors(selectedState.colors);

      // When setting the colors, the active color is reset to the first color.
      // We need to set it back to the index of the color that was active before, otherwise it jumps to the first color and drags that instead
      this.picker.setActiveColor(this.indexOfCurrentActiveColor);
    });

    this.picker.on('color:change', (color: iro.Color) => {
      this.indexOfCurrentActiveColor = color.index;
      const colors = this.picker.colors.map(c => new iro.Color(c));
      this.skipSettingColors = true;
      this.store.dispatch(new ChangeRoomColors(colors));
    });
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

  private getActiveColorPickerLayout(): ColorPickerLayoutOptions {
    return [
      {
        component: iro.ui.Wheel,
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
    ];
  }

  private getInactiveColorPickerLayout(): ColorPickerLayoutOptions {
    return [];
  };

  private enableColorPicker() {
    this.picker.setOptions({layout: this.getActiveColorPickerLayout()});
    this.isEnabled = true;
  }

  private disableColorPicker() {
    this.picker.setOptions({layout: this.getInactiveColorPickerLayout()});
    this.isEnabled = false;
  }
}

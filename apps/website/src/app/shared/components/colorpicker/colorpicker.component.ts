import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import iro from "@jaames/iro";
import { IroColor } from "@irojs/iro-core";
import { IroColorPicker } from "@jaames/iro/dist/ColorPicker";
import { Store } from "@ngrx/store";
import { ColorpickerState } from "../../../../redux/color/color.reducer";
import { colorChange } from "../../../../redux/color/color.action";
import { ChangeLedstripColors } from "../../../../redux/ledstrip/ledstrip.action";
import { LedstripState } from "@angulon/interfaces";

export type ColorpickerEvent = {
  color: iro.Color
  colorpicker: iro.ColorPicker
}

@Component({
  selector: "app-colorpicker",
  templateUrl: "./colorpicker.component.html",
  styleUrls: ["./colorpicker.component.scss"]
})
export class ColorpickerComponent implements OnInit, AfterViewInit {
  protected id = this.generateElementId();
  private picker!: IroColorPicker;
  private indexOfCurrentActiveColor = 0;

  /**
   * Options to configure the colorpicker, there is no type for it available..
   * See the docs for available options
   * @see https://iro.js.org/colorPicker_api.html#options
   * @private
   */
  private colorpickerOptions: Parameters<typeof iro.ColorPicker>[1] = {
    width: 150,
    layoutDirection: "horizontal",
    handleRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    wheelAngle: 90,
    layout: [
      {
        component: iro.ui.Wheel
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "value",
          activeIndex: 0
        }
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "value",
          activeIndex: 1
        }
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "value",
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
    this.picker = iro.ColorPicker(`#${this.id}`, this.colorpickerOptions);

    this.store.select("ledstripState").subscribe((state) => {
      if(!state) return;
      this.picker.setColors(state.colors);

      // When setting the colors, the active color is reset to the first color.
      // We need to set it back to the index of the color that was active before, otherwise it jumps to the first color and drags that instead
      this.picker.setActiveColor(this.indexOfCurrentActiveColor);
    });

    this.picker.on("color:change", (color: iro.Color) => {
      this.indexOfCurrentActiveColor = color.index;
      const colors = this.picker.colors.map(c => c.hexString);
      this.store.dispatch(new ChangeLedstripColors(colors));
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
    return "colorpicker-" + array.join("-");
  }

  changeOrientation(direction: "horizontal" | "vertical") {
    this.picker.setOptions({ layoutDirection: direction });
  }
}

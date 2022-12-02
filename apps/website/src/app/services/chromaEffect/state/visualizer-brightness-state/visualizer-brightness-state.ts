import iro from '@jaames/iro'
import {VisualizerState} from '../visualizer-state/visualizer-state'
import {calculateBGRInteger, map} from '../../../../shared/functions'

export class VisualizerBrightnessState extends VisualizerState {

  override set intensity(value: number) {
    this._previousIntensity = this._intensity
    this._intensity = value
  }

  override handle(colors: iro.Color[]): void {
    if (!colors) return

    map(this._intensity, 0, 1, 0, 255, true)


    this.createVisualizer(colors)
  }

  override createVisualizer(colors: iro.Color[], backgroundColor = 0): void {
    this._BGRIntegerForeground = calculateBGRInteger(colors[0].red, colors[0].green, colors[0].blue)
    this.visualizerCounter++

    if (this.visualizerCounter % 5 !== 0 || this._intensity === this._previousIntensity) {
      return
    } else {
      this.visualizerCounter = 0
    }

    // this.createHeadsetVisualizer();
    this.createKeyBoardVisualizer(backgroundColor)
    // this.createMouseVisualizer(backgroundColor);

    this._previousBGRIntegerForeground = this._BGRIntegerForeground
  }

  override createMouseVisualizer(backgroundColor: number) {
    // Mouse
    const mouseLed = new Array(9)
    for (let r = 0; r < 9; r++) {
      mouseLed[r] = new Array(7)
      for (let c = 0; c < 7; c++) {
        mouseLed[r][c] = backgroundColor
      }
    }

    // Column 0 is left side
    // Column 6 is right side
    // Razer mamba only has 7 visible.
    const amountOfRows = map(this._intensity, 0, 1, 0, 7, true)
    for (let r = 0; r < amountOfRows; r++) {
      mouseLed[r][0] = this._BGRIntegerForeground
      mouseLed[r][6] = this._BGRIntegerForeground
    }
    // Row 2 Column 3 has wheel
    // Row 7 Column 3 has logo
    mouseLed[2][3] = this._BGRIntegerForeground
    mouseLed[7][3] = this._BGRIntegerForeground
    this._context.createMouseEffect('CHROMA_CUSTOM2', mouseLed).then()
  }

  override createKeyBoardVisualizer(backgroundColor: number) {
    const color = new Array(6)
    const key = new Array(6)
    for (let r = 0; r < 6; r++) {
      color[r] = new Array(22)
      key[r] = new Array(22)
      for (let c = 0; c < 22; c++) {
        color[r][c] = this._BGRIntegerForeground
        key[r][c] = 128
      }
    }

    const data = {color, key}

    this._context.createKeyboardEffect('CHROMA_CUSTOM_KEY', data).then()
  }

  override createHeadsetVisualizer() {
    if (this._BGRIntegerForeground !== this._previousBGRIntegerForeground) {
      this._context.createHeadsetEffect('CHROMA_STATIC', this._BGRIntegerForeground).then()
    }
  }

  override onEntry(): void {
  }

  override onExit(): void {
  }
}

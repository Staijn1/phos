import {State} from '../abstract/state'
import {calculateBGRInteger, map} from '../../../../shared/functions'
import iro from '@jaames/iro'

export class VisualizerState extends State {
  private _intensity = 0;
  private visualizerCounter = 0;
  private _BGRIntegerForeground;
  private _previousBGRIntegerForeground;
  private _previousIntensity: number;

  handle(colors: iro.Color[]): void {
    if (!colors) return
    this.createVisualizer(colors)
  }

  createVisualizer(colors: iro.Color[], backgroundColor = 0): void {
    this._BGRIntegerForeground = calculateBGRInteger(colors[0].red, colors[0].green, colors[0].blue)
    this.visualizerCounter++

    if (this.visualizerCounter % 5 !== 0 || this._intensity === this._previousIntensity) {
      return
    } else {
      this.visualizerCounter = 0
    }

    this.createHeadsetVisualizer();
    this.createKeyBoardVisualizer(backgroundColor);
    this.createMouseVisualizer(backgroundColor);

    this._previousBGRIntegerForeground = this._BGRIntegerForeground;
  }

  private createMouseVisualizer(backgroundColor: number) {
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

  private createKeyBoardVisualizer(backgroundColor: number) {
    const color = new Array(6)
    for (let r = 0; r < 6; r++) {
      color[r] = new Array(22)
      for (let c = 0; c < 22; c++) {
        color[r][c] = backgroundColor
      }
    }
    const key = new Array(6)
    for (let r = 0; r < 6; r++) {
      key[r] = new Array(22)
      for (let c = 0; c < 22; c++) {
        key[r][c] = backgroundColor
      }
    }

    const amountOfColumns = map(this._intensity, 1, 0, 21, 0, true)
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < amountOfColumns; c++) {
        key[r][c] = 0x01000000 | this._BGRIntegerForeground
      }

    }
    const data = {color, key}

    this._context.createKeyboardEffect('CHROMA_CUSTOM_KEY', data).then()
  }

  private createHeadsetVisualizer() {
    if (this._BGRIntegerForeground !== this._previousBGRIntegerForeground) {
      this._context.createHeadsetEffect('CHROMA_STATIC', this._BGRIntegerForeground).then()
    }
  }

  set intensity(value: number) {
    this._previousIntensity = this._intensity
    this._intensity = value
  }

  onEntry(): void {
  }

  onExit(): void {
  }
}

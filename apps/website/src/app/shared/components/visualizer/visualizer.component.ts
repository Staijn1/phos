import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core'
import AudioMotionAnalyzer, {Options} from 'audiomotion-analyzer'
import {GradientInformation} from '@angulon/interfaces';


@Component({
  selector: 'app-shared-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss'],
})
export class VisualizerComponent implements OnInit, OnDestroy {
  @Output() ready: EventEmitter<AudioMotionAnalyzer> = new EventEmitter<AudioMotionAnalyzer>();
  @Output() registeredGradients: EventEmitter<GradientInformation[]> = new EventEmitter<GradientInformation[]>();
  private audioMotion: AudioMotionAnalyzer | undefined
  private _options!: Options
  private _gradients!: GradientInformation[]

  @Input() set options(options: Options) {
    this._options = {
      ...options,
      ...{connectSpeakers: false},
    }
    this.updateOptions()
  }


  @Input() set gradients(gradients: GradientInformation[]) {
    this._gradients = gradients
    this.registerGradients()
  }


  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.audioMotion?.toggleAnalyzer()
    this._gradients = []
    this.audioMotion = undefined
  }

  private init(): void {
    const elem = document.getElementById('visualizer')
    this.audioMotion = new AudioMotionAnalyzer(elem as HTMLElement, this._options)
    this.setSource()
    this.ready.emit(this.audioMotion)
  }

  private setSource(): void {
    navigator.mediaDevices.getUserMedia({audio: true, video: false})
      .then(stream => {
        if (!this.audioMotion) return;
        const audioCtx = this.audioMotion.audioCtx
        const micInput = audioCtx.createMediaStreamSource(stream)
        this.audioMotion.disconnectInput()
        this.audioMotion.connectInput(micInput)
      })
      .catch(err => {
        console.error(`Could not change audio source`, err)
      })
  }

  updateOptions(): void {
    if (this.audioMotion) {
      this.audioMotion.setOptions(this._options)
    }
  }

  private registerGradients(): void {
    if (this._gradients.length === 0) return;
    if (!this.audioMotion) throw Error('No visualizer!')

    for (const gradient of this._gradients) {
      this.audioMotion.registerGradient(gradient.name, {...gradient})
    }
    this.registeredGradients.emit(this._gradients)
  }

  toggleFullscreen() {
    this.audioMotion?.toggleFullscreen()
  }
}

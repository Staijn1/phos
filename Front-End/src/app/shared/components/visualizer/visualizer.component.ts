import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import AudioMotionAnalyzer, { Options } from 'audiomotion-analyzer'
import { GradientInformation } from '../../types/GradientInformation'

@Component({
  selector: 'app-shared-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss'],
})
export class VisualizerComponent implements OnInit, OnDestroy {
  private audioMotion: AudioMotionAnalyzer
  private _options: Options
  private _gradients: GradientInformation[]

  @Input() set options(options: Options) {
    this._options = {
      ...options,
      ...{ volume: 0 },
    }
    this.updateOptions()
  }


  @Input() set gradients(gradients: GradientInformation[]) {
    console.log("Gradients changed in setter")
    this._gradients = gradients
    this.registerGradients()
  }


  ngOnInit(): void {
    this.init()
  }

  ngOnDestroy(): void {
    this.audioMotion.toggleAnalyzer()
    this._gradients = undefined
    this.audioMotion = undefined
  }

  private init(): void {
    const elem = document.getElementById('visualizer')
    this.audioMotion = new AudioMotionAnalyzer(elem, this._options)
    this.setSource()
  }

  private setSource(): void {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
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
    console.log("Registering gradients")
    if (!this._gradients) {
      throw Error('No gradients!')
    }

    for (const gradient of this._gradients) {
      this.audioMotion.registerGradient(gradient.name, { bgColor: gradient.bgColor, colorStops: gradient.colorStops })
    }
  }

  toggleFullscreen() {
    this.audioMotion.toggleFullscreen()
  }
}

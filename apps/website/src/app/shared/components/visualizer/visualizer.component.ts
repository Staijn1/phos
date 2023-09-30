import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import AudioMotionAnalyzer, { GradientOptions, Options } from 'audiomotion-analyzer';
import { GradientInformation } from '@angulon/interfaces';
import { MessageService } from '../../../services/message-service/message.service';


@Component({
  selector: 'app-shared-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @Output() ready: EventEmitter<AudioMotionAnalyzer> = new EventEmitter<AudioMotionAnalyzer>();
  @Output() registeredGradients: EventEmitter<GradientInformation[]> = new EventEmitter<GradientInformation[]>();
  private audioMotion: AudioMotionAnalyzer | undefined;

  constructor(private readonly messageService: MessageService) {
  }

  private _options!: Options;

  @Input() set options(options: Options) {
    this._options = {
      ...options,
      ...{ connectSpeakers: false }
    };
    this.updateOptions();
  }

  private _gradients!: GradientInformation[];

  @Input() set gradients(gradients: GradientInformation[]) {
    this._gradients = gradients;
    this.registerGradients();
  }

  ngOnDestroy(): void {
    this.audioMotion?.toggleAnalyzer();
    this._gradients = [];
    this.audioMotion = undefined;
  }

  updateOptions(): void {
    if (this.audioMotion) {
      this.audioMotion.setOptions(this._options);
    }
  }

  toggleFullscreen() {
    this.audioMotion?.toggleFullscreen();
  }

  ngAfterViewInit(): void {
    this.init();
  }

  /**
   * Register one single gradient.
   * Does not emit the gradients because the gradient is only used internally for the visualizer.
   * @param name
   * @param gradient
   */
  registerGradient(name: string, gradient: GradientOptions) {
    if (!this.audioMotion) throw Error('No visualizer!');
    this.audioMotion.registerGradient(name, gradient);
  }

  private init(): void {
    this.audioMotion = new AudioMotionAnalyzer(this.container.nativeElement, this._options);
    this.setSource();
    this.ready.emit(this.audioMotion);
  }

  private setSource(): void {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => {
        if (!this.audioMotion) return;
        const audioCtx = this.audioMotion.audioCtx;
        const micInput = audioCtx.createMediaStreamSource(stream);
        this.audioMotion.disconnectInput();
        this.audioMotion.connectInput(micInput);
      })
      .catch(err => {
        console.error('Could not change audio source', err);
        this.messageService.setMessage({
          name: 'SET_SOURCE_FAILED',
          message: 'Could not set audio source for the audio-visualizer. Was microphone access granted?'
        });
      });
  }

  private registerGradients(): void {
    if (this._gradients.length === 0) return;
    if (!this.audioMotion) throw Error('No visualizer!');

    for (const gradient of this._gradients) {
      this.audioMotion.registerGradient(gradient.name, { ...gradient });
    }
    this.registeredGradients.emit(this._gradients);
  }
}

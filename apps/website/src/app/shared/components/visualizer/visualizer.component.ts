import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from "@angular/core";
import AudioMotionAnalyzer, { GradientOptions, Options } from "audiomotion-analyzer";
import { GradientInformation } from "@angulon/interfaces";
import { MessageService } from "../../../services/message-service/message.service";
import { UserPreferences } from "../../types/types";
import { Store } from "@ngrx/store";
import { combineLatest, map, skipWhile } from "rxjs";


@Component({
  selector: "app-shared-visualizer",
  templateUrl: "./visualizer.component.html",
  styleUrls: ["./visualizer.component.scss"]
})
export class VisualizerComponent implements OnDestroy, AfterViewInit {
  @ViewChild("container") container!: ElementRef<HTMLDivElement>;
  @Output() ready: EventEmitter<AudioMotionAnalyzer> = new EventEmitter<AudioMotionAnalyzer>();
  audioMotion: AudioMotionAnalyzer | undefined;

  constructor(private readonly messageService: MessageService, private store: Store<{
    userPreferences: UserPreferences,
    gradients: GradientInformation[]
  }>) {
    combineLatest([
      this.store.select("userPreferences").pipe(map((userPreferences) => userPreferences.visualizerOptions)),
      this.store.select("gradients").pipe(skipWhile(gradients => gradients.length === 0))
    ])
      .subscribe(([visualizerOptions, gradients]) => {
        this.registerGradients(structuredClone(gradients));
        this.options = {
          ...visualizerOptions,
          ...{ connectSpeakers: false }
        };
        this.applyOptions();
      });
  }

  private options!: Options;

  ngOnDestroy(): void {
    this.audioMotion?.toggleAnalyzer();
    this.audioMotion = undefined;
  }

  applyOptions(): void {
    this.audioMotion?.setOptions(this.options);
  }

  toggleFullscreen() {
    this.audioMotion?.toggleFullscreen();
  }

  ngAfterViewInit(): void {
    this.audioMotion = new AudioMotionAnalyzer(this.container.nativeElement, {connectSpeakers: false});
    this.ready.emit(this.audioMotion);
    this.setSource();
    this.applyOptions();
  }

  /**
   * Register one single gradient.
   * Does not emit the gradients because the gradient is only used internally for the visualizer.
   * @param name
   * @param gradient
   */
  registerGradient(name: string, gradient: GradientOptions) {
    if (!this.audioMotion) throw Error("No visualizer!");
    this.audioMotion.registerGradient(name, gradient);
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
        console.error("Could not change audio source", err);
        this.messageService.setMessage({
          name: "SET_SOURCE_FAILED",
          message: "Could not set audio source for the audio-visualizer. Was microphone access granted?"
        });
      });
  }

  public registerGradients(gradients: GradientInformation[]): void {
    if (!this.audioMotion) throw Error("No visualizer!");

    for (const gradient of gradients) {
      this.audioMotion.registerGradient(gradient.name, { ...gradient });
    }
  }
}

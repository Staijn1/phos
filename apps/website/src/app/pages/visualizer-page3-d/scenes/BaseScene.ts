import * as THREE from 'three'
import {PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import {ElementRef} from '@angular/core'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise'
import {LedstripCommandService} from '../../../services/ledstrip-command/ledstrip-command.service'
import AudioMotionAnalyzer, {Options} from 'audiomotion-analyzer'
import {SettingsService} from '../../../services/settings/settings.service'
import {GUI} from 'dat.gui'

export abstract class BaseScene {
  protected scene: Scene | undefined;
  protected readonly frequencyLimits = {
    bass: [20, 140],
    lowMid: [140, 400],
    mid: [400, 2600],
    highMid: [2600, 5200],
    treble: [5200, 14000],
  }
  protected camera!: PerspectiveCamera;
  protected gui!: GUI;
  protected noise!: SimplexNoise
  protected audioMotion: AudioMotionAnalyzer | undefined;
  private renderer: WebGLRenderer | undefined;
  private isActive = false;
  private _options: Options = {
    volume: 0,
    useCanvas: false,
    smoothing: this.settingsService.readVisualizerOptions().smoothing
  }

  public constructor(protected threeContainer: ElementRef, protected readonly connection: LedstripCommandService, protected readonly settingsService: SettingsService) {
    Object.freeze(this.frequencyLimits)
  }

  get bass(): number {
    return this.audioMotion?.getEnergy('bass') || 0
  }

  get lowMid(): number {
    return this.audioMotion?.getEnergy('lowMid') || 0
  }

  get mid(): number {
    return this.audioMotion?.getEnergy('mid') || 0
  }

  get highMid(): number {
    return this.audioMotion?.getEnergy('highMid') || 0
  }

  get treble(): number {
    return this.audioMotion?.getEnergy('treble') || 0
  }

  get width(): number {
    return window.innerWidth
  }

  get height(): number {
    return window.innerHeight * 0.7
  }

  onResize(event: any) {
    this.threeContainer.nativeElement.width = this.width
    this.threeContainer.nativeElement.height = this.height
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  public init(): void {
    this.noise = new SimplexNoise()
    // Debug
    this.gui = new GUI()
    this.scene = new THREE.Scene()
    window.onresize = this.onResize.bind(this)

    this.isActive = true
    this.renderer = new THREE.WebGLRenderer({canvas: this.threeContainer.nativeElement, antialias: true, alpha: false})
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.camera = new THREE.PerspectiveCamera(65, this.width / this.height, 0.1, 1000)

    const orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    orbitControls.autoRotate = true

    this.getMediaStream()
      .then(stream => {
        this.setupAnalyser(stream)
        this.setup()
        this.render()
      })
      .catch(err => {
        console.error(`Could not change audio source`, err)
      })
  }

  public uninit(): void {
    this.gui.destroy()
    this.audioMotion?.toggleAnalyzer(false)
    this.scene = undefined
    this.renderer = undefined
    this.isActive = false
    this.audioMotion = undefined
  }

  protected abstract setup(): any

  protected abstract animate(): any

  private render() {
    this.animate()
    this.renderer?.render(this.scene as Scene, this.camera)

    this.sendFFTData()
    if (this.isActive) {
      window.requestAnimationFrame(this.render.bind(this))
    }
  }

  private async getMediaStream(): Promise<MediaStream> {
    this.audioMotion = new AudioMotionAnalyzer(undefined, this._options)
    return navigator.mediaDevices.getUserMedia({audio: true, video: false})
  }

  private sendFFTData() {
    this.connection.setLeds(this.bass)
  }

  private setupAnalyser(stream: MediaStream) {
    if (!this.audioMotion) return;
    const audioCtx = this.audioMotion.audioCtx
    const micInput = audioCtx.createMediaStreamSource(stream)
    this.audioMotion.disconnectInput()
    this.audioMotion.connectInput(micInput)
  }
}

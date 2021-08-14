import * as THREE from 'three'
import {PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import {ElementRef} from '@angular/core'
import {GUI} from 'three/examples/jsm/libs/dat.gui.module'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise'
import {ConnectionService} from '../../../services/connection/connection.service'
import AudioMotionAnalyzer, {Options} from 'audiomotion-analyzer'
import {SettingsService} from '../../../services/settings/settings.service'

export abstract class BaseScene {
  private renderer: WebGLRenderer;
  protected scene: Scene;
  protected readonly frequencyLimits = {
    bass: [20, 140],
    lowMid: [140, 400],
    mid: [400, 2600],
    highMid: [2600, 5200],
    treble: [5200, 14000],
  }
  protected camera: PerspectiveCamera;
  protected gui: GUI;
  protected noise: SimplexNoise
  private isActive: boolean;
  private _options: Options = {
    volume: 0,
    useCanvas: false,
    smoothing: this.settingsService.readVisualizerOptions().smoothing
  }
  protected audioMotion: AudioMotionAnalyzer;

  protected constructor(protected threeContainer: ElementRef, protected readonly connection: ConnectionService, protected readonly settingsService: SettingsService) {
    this.noise = new SimplexNoise()
    // Debug
    this.gui = new GUI()
    this.scene = new THREE.Scene()
    this.init()
    Object.freeze(this.frequencyLimits)
  }

  onResize(event) {
    const curWidth = window.innerWidth
    const curHeight = window.innerHeight
    this.threeContainer.nativeElement.width = curWidth
    this.threeContainer.nativeElement.height = curHeight
    this.camera.aspect = curWidth / curHeight
    this.camera.updateProjectionMatrix()
  }

  protected abstract setup()

  protected abstract animate()

  private init(): void {
    window.onresize = this.onResize.bind(this)

    this.isActive = true
    this.renderer = new THREE.WebGLRenderer({canvas: this.threeContainer.nativeElement, antialias: true, alpha: false})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000)

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

  private render() {

    this.animate()
    this.renderer.render(this.scene, this.camera)

    this.sendFFTData()
    if (this.isActive) {
      window.requestAnimationFrame(this.render.bind(this))
    }
  }

  private async getMediaStream(): Promise<MediaStream> {
    this.audioMotion = new AudioMotionAnalyzer(null, this._options)
    return navigator.mediaDevices.getUserMedia({audio: true, video: false})
  }

  public uninit(): void {
    this.gui.destroy()
    this.audioMotion.toggleAnalyzer(false)
    this.scene = undefined
    this.renderer = undefined
    this.isActive = false
    this.audioMotion = undefined
  }

  private sendFFTData() {
    this.connection.setLeds(this.bass)
  }

  private setupAnalyser(stream: MediaStream) {
    const audioCtx = this.audioMotion.audioCtx
    const micInput = audioCtx.createMediaStreamSource(stream)
    this.audioMotion.disconnectInput()
    this.audioMotion.connectInput(micInput)
  }

  get bass(): number {
    return this.audioMotion.getEnergy('bass')
  }

  get lowMid(): number {
    return this.audioMotion.getEnergy('lowMid')
  }

  get mid(): number {
    return this.audioMotion.getEnergy('mid')
  }

  get highMid(): number {
    return this.audioMotion.getEnergy('highMid')
  }

  get treble(): number {
    return this.audioMotion.getEnergy('treble')
  }
}
import * as THREE from 'three'
import {PerspectiveCamera, Scene, WebGLRenderer} from 'three'
import {ElementRef} from '@angular/core'
import {GUI} from 'three/examples/jsm/libs/dat.gui.module'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise'
import {ConnectionService} from '../../../services/connection/connection.service'

export abstract class BaseScene {
  private renderer: WebGLRenderer;
  protected scene: Scene;
  protected analyser: AnalyserNode;
  protected readonly frequencyLimits = {
    bass: [20, 140],
    lowMid: [140, 400],
    mid: [400, 2600],
    highMid: [2600, 5200],
    treble: [5200, 14000],
  }
  protected camera: PerspectiveCamera;
  protected gui: GUI;
  protected averageMidTreble: number = 0;
  protected averageBass: number = 0;
  protected noise: SimplexNoise
  private isActive: boolean;

  protected constructor(protected threeContainer: ElementRef, protected readonly connection: ConnectionService) {
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

    this.setupAnalyser()
    this.setup()
    this.render()
  }

  private render() {
    this.collectFFTData()
    this.animate()
    this.renderer.render(this.scene, this.camera)

    this.sendFFTData()
    if (this.isActive) {
      window.requestAnimationFrame(this.render.bind(this))
    }
  }

  private setupAnalyser() {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        const audioContext = new AudioContext()
        const micInput = audioContext.createMediaStreamSource(stream)
        // Create a volume and set it to 0 gain, to prevent sending the mic input through your speakers.
        const volume = audioContext.createGain()
        volume.gain.value = 0

        // Create an analyser with fftSize being a power of 2
        this.analyser = audioContext.createAnalyser()
        this.analyser.fftSize = 1024

        micInput.connect(this.analyser)
        this.analyser.connect(volume)
      })
      .catch(err => {
        console.error(`Could not change audio source`, err)
      })
  }

  private collectFFTData() {
    if (this.analyser) {
      const bufferLength = this.analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      this.analyser.getByteFrequencyData(dataArray)


      const totalBass = dataArray.slice(this.frequencyLimits.bass[0], this.frequencyLimits.bass[1]).reduce((accumelator, value) => accumelator + value, 0)
      this.averageBass = totalBass / (this.frequencyLimits.bass[1] - this.frequencyLimits.bass[0])

      const lowMidTreble = dataArray.slice(this.frequencyLimits.lowMid[0], this.frequencyLimits.bass[1]).reduce((accumulator, value) => accumulator + value, 0)
      this.averageMidTreble = lowMidTreble / (this.frequencyLimits.lowMid[1] - this.frequencyLimits.lowMid[0])
    }
  }

  public uninit(): void {
    this.gui.destroy()
    this.scene = undefined
    this.renderer = undefined
    this.isActive = false
    this.analyser = undefined
  }

  private sendFFTData() {
    this.connection.setLeds(this.averageBass)
  }
}

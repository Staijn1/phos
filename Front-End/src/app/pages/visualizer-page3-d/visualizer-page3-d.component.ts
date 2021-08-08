import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core'
import {GUI} from 'three/examples/jsm/libs/dat.gui.module'
import * as THREE from 'three'
import {
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  TorusGeometry,
  WebGLRenderer
} from 'three'

@Component({
  selector: 'app-visualizer-page3-d',
  templateUrl: './visualizer-page3-d.component.html',
  styleUrls: ['./visualizer-page3-d.component.scss']
})
export class VisualizerPage3DComponent implements AfterViewInit {
  @ViewChild('threeContainer') threeContainer: ElementRef;
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private clock: Clock
  private scene: Scene;
  private plane: Mesh<PlaneGeometry, MeshBasicMaterial>;

  ngAfterViewInit(): void {
    // Canvas
    this.scene = new THREE.Scene()

    // Objects
    const planeGeometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64)

    // Materials
    const planeMaterial = new THREE.MeshBasicMaterial({color: 'gray'})

    // Mesh
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial)
    this.plane.rotation.x = 181
    this.scene.add(this.plane)

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 2)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    this.scene.add(pointLight)

    this.camera = new THREE.PerspectiveCamera(65, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 3
    this.scene.add(this.camera)

    this.renderer = new THREE.WebGLRenderer({canvas: this.threeContainer.nativeElement})
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.clock = new THREE.Clock()

    // Debug
    const gui = new GUI()
    gui.add(this.camera.position, 'x').min(0).max(10).name('Camera X')
    gui.add(this.camera.position, 'y').min(0).max(10).name('Camera Y')
    gui.add(this.camera.position, 'z').min(0).max(10).name('Camera Z')
    const obj = {color: '#00ff00'}
    gui.addColor(obj, 'color').onChange(() => {
      pointLight.color.set(obj.color)
      console.log(obj.color, pointLight.color)
    })
    this.render()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight
    this.threeContainer.nativeElement.width = this.sizes.width
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()
  }

  render(): void {
    const elapsedTime = this.clock.getElapsedTime()

    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.render.bind(this))
  }
}

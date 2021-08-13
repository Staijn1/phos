import {BaseScene} from './BaseScene'
import * as THREE from 'three'
import {IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry} from 'three'
import {map} from '../../../shared/functions'
import {ElementRef} from '@angular/core'
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise'

export class SphereScene extends BaseScene {
  private upperPane: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private bottomPane: Mesh<PlaneGeometry, MeshLambertMaterial>;
  private ball: Mesh<IcosahedronGeometry, MeshLambertMaterial>;


  constructor(readonly threeContainer: ElementRef) {
    super(threeContainer)
  }

  private setupPanes(): void {
    // Objects
    const planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20)

    // Materials
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: '#5110a8',
      side: THREE.DoubleSide,
      wireframe: true
    })

    // Mesh
    this.upperPane = new THREE.Mesh(planeGeometry, planeMaterial)
    this.upperPane.rotation.x = -0.5 * Math.PI
    this.upperPane.position.set(0, 30, 0)
    this.scene.add(this.upperPane)

    this.bottomPane = new THREE.Mesh(planeGeometry, planeMaterial)
    this.bottomPane.rotation.x = -0.5 * Math.PI
    this.bottomPane.position.set(0, -30, 0)
    this.scene.add(this.bottomPane)
  }

  private setupLights(): void {
    // Lights
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.2)
    this.scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff, 0.9)
    spotLight.position.set(-5, -1, 49)
    spotLight.lookAt(this.ball.position)
    this.scene.add(spotLight)

    this.gui.add(spotLight.position, 'x').min(-100).max(100).name('X Light')
    this.gui.add(spotLight.position, 'y').min(-100).max(100).name('Y Light')
    this.gui.add(spotLight.position, 'z').min(-100).max(100).name('Z Light')
  }

  private setupBall(): void {
    const icosahedronGeometry = new THREE.IcosahedronGeometry(10, 6)
    const lambertMaterial = new THREE.MeshLambertMaterial({
      color: 0xff00ee,
      wireframe: true
    })
    this.ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial)
    this.ball.position.set(0, 0, 0)
    this.scene.add(this.ball)
  }

  private makeRoughBall(mesh: Mesh<IcosahedronGeometry, MeshLambertMaterial>, bassFr: number) {
    const positionAttribute = mesh.geometry.getAttribute('position')
    const vertex = new THREE.Vector3()
    for (let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++) {
      vertex.fromBufferAttribute(positionAttribute, vertexIndex)
      const offset = mesh.geometry.parameters.radius
      const amp = 7
      const time = window.performance.now()
      vertex.normalize()
      const rf = 0.00001
      const distance = (offset + bassFr) + this.noise.noise3d(
        vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * amp
      vertex.multiplyScalar(distance)
      positionAttribute.setXYZ(vertexIndex, vertex.x, vertex.y, vertex.z)
    }
    mesh.geometry.attributes.position.needsUpdate = true // required after the first render
  }

  private animatePlane(mesh: Mesh<PlaneGeometry, MeshBasicMaterial>, rawFFTValue: number): void {
    const fftValue = map(rawFFTValue, 0, 255, 0, 4)
    const positionAttribute = mesh.geometry.getAttribute('position')
    const vertex = new THREE.Vector3()
    for (let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++) {
      vertex.fromBufferAttribute(positionAttribute, vertexIndex)
      const amp = 2
      const time = performance.now()
      const distance = this.noise.noise(vertex.x + time * 0.0004, vertex.y + time * 0.0001) * fftValue * amp

      if (vertexIndex == 0 && time % 10 === 0){
        console.log(distance)
      }
      vertex.z = distance
      positionAttribute.setXYZ(vertexIndex, vertex.x, vertex.y, vertex.z)
    }
    mesh.geometry.attributes.position.needsUpdate = true // required after the first render
  }

  protected setup() {
    this.setupBall()
    this.setupLights()
    this.setupPanes()

    this.camera.position.set(0, 0, 100)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)
  }

  protected animate() {
    this.makeRoughBall(this.ball, map(this.averageBass, 0, 255, 0, 10))
    // todo doet het niet?
    this.animatePlane(this.upperPane, this.averageBass)
    this.animatePlane(this.bottomPane, this.averageMidTreble)
  }
}

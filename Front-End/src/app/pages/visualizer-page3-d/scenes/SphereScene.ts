import {BaseScene} from './BaseScene'
import * as THREE from 'three'
import {IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry} from 'three'
import {map} from '../../../shared/functions'
import {ElementRef} from '@angular/core'
import {ConnectionService} from '../../../services/connection/connection.service'
import {degToRad} from 'three/src/math/MathUtils'
import {SettingsService} from '../../../services/settings/settings.service'

export class SphereScene extends BaseScene {
  private upperPane: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private bottomPane: Mesh<PlaneGeometry, MeshLambertMaterial>;
  private ball: Mesh<IcosahedronGeometry, MeshLambertMaterial>;


  constructor(readonly threeContainer: ElementRef, readonly connection: ConnectionService, readonly settingsService: SettingsService) {
    super(threeContainer, connection, settingsService)
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
    // const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.2)
    // this.scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff, 2.1)
    spotLight.castShadow = true
    spotLight.position.set(-5, 51, 49)
    spotLight.lookAt(this.ball.position)

    this.scene.add(spotLight)

    this.gui.add(spotLight, 'intensity').min(0).max(3).step(0.1).name('Intensity')

    this.gui.add(spotLight.position, 'x').min(-100).max(100).name('X position')
    this.gui.add(spotLight.position, 'y').min(-100).max(100).name('Y position')
    this.gui.add(spotLight.position, 'z').min(-100).max(100).name('Z position')

    this.gui.add(spotLight.rotation, 'x').min(-100).max(100).name('X rotation')
    this.gui.add(spotLight.rotation, 'y').min(-100).max(100).name('Y rotation')
    this.gui.add(spotLight.rotation, 'z').min(-100).max(100).name('Z rotation')

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

  private animateBall(mesh: Mesh<IcosahedronGeometry, MeshLambertMaterial>) {
    const fftValue = map(this.bass, 0, 1, 0, 10)
    const positionAttribute = mesh.geometry.getAttribute('position')
    const vertex = new THREE.Vector3()
    for (let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++) {
      vertex.fromBufferAttribute(positionAttribute, vertexIndex)
      const offset = mesh.geometry.parameters.radius
      const amp = 7
      const time = window.performance.now()
      vertex.normalize()
      const rf = 0.00001
      const distance = (offset + fftValue) + this.noise.noise3d(
        vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * amp
      vertex.multiplyScalar(distance)
      positionAttribute.setXYZ(vertexIndex, vertex.x, vertex.y, vertex.z)
    }
    mesh.geometry.attributes.position.needsUpdate = true

    mesh.rotateX(degToRad(0.15))
    mesh.rotateZ(degToRad(0.07))
  }

  private animatePlane(mesh: Mesh<PlaneGeometry, MeshBasicMaterial>, rawFFTValue: number): void {
    const fftValue = map(rawFFTValue, 0, 1, 0, 10)
    const positionAttribute = mesh.geometry.getAttribute('position')
    const vertex = new THREE.Vector3()
    for (let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++) {
      vertex.fromBufferAttribute(positionAttribute, vertexIndex)
      const amp = 2
      const time = performance.now()
      const distance = this.noise.noise(vertex.x + time * 0.0004, vertex.y + time * 0.0002) * fftValue * amp
      vertex.z = distance
      positionAttribute.setXYZ(vertexIndex, vertex.x, vertex.y, vertex.z)
    }
    mesh.geometry.attributes.position.needsUpdate = true // required after the first render
  }

  protected setup() {
    this.setupBall()
    this.setupLights()
    this.setupPanes()
    this.setupCamera()
  }

  private setupCamera() {
    this.camera.position.set(0, 4, 64)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)
  }

  protected animate() {
    this.animateBall(this.ball)
    this.animatePlane(this.upperPane, this.treble)
    this.animatePlane(this.bottomPane, this.lowMid)
  }
}

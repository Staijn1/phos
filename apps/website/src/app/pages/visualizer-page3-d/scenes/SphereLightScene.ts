import {BaseScene} from './BaseScene'
import * as THREE from 'three'
import {Mesh, MeshStandardMaterial, SphereGeometry, Texture} from 'three'
import {degToRad} from 'three/src/math/MathUtils'

export class SphereLightScene extends BaseScene {
  private ball!: Mesh<SphereGeometry, MeshStandardMaterial>;
  private normalTexture!: Texture;

  protected setup() {
    this.loadTextures()
    this.setupSphere()
    this.setupLights()
    this.setupCamera()
  }

  protected animate() {
    this.animateBall(this.ball)
  }

  private loadTextures(): void {
    const textureLoader = new THREE.TextureLoader()
    this.normalTexture = textureLoader.load('../../../../assets/normal-maps/dimples.png')
  }

  private setupLights(): void {
    // Lights
    const spotLight = new THREE.SpotLight(0xffffff, 2.1)
    spotLight.castShadow = true
    spotLight.position.set(-5, 51, 49)
    spotLight.lookAt(this.ball.position)

    this.scene?.add(spotLight)

    this.gui.add(spotLight, 'intensity').min(0).max(3).step(0.1).name('Intensity')

    this.gui.add(spotLight.position, 'x').min(-100).max(100).name('X position')
    this.gui.add(spotLight.position, 'y').min(-100).max(100).name('Y position')
    this.gui.add(spotLight.position, 'z').min(-100).max(100).name('Z position')

    this.gui.add(spotLight.rotation, 'x').min(-100).max(100).name('X rotation')
    this.gui.add(spotLight.rotation, 'y').min(-100).max(100).name('Y rotation')
    this.gui.add(spotLight.rotation, 'z').min(-100).max(100).name('Z rotation')

  }

  private setupSphere(): void {
    const geometry = new THREE.SphereGeometry(0.5, 64, 64)
    const lambertMaterial = new THREE.MeshStandardMaterial({
      color: 0xff00ee,
      metalness: 0.7,
      roughness: 0.2,
      normalMap: this.normalTexture
    })
    this.ball = new THREE.Mesh(geometry, lambertMaterial)
    this.ball.position.set(0, 0, 0)
    this.scene?.add(this.ball)
  }

  private animateBall(mesh: Mesh<SphereGeometry, MeshStandardMaterial>) {
    mesh.rotateX(degToRad(0.15))
    mesh.rotateZ(degToRad(0.07))
  }

  private setupCamera() {
    if (!this.scene) return;
    this.camera.position.set(0, 4, 64)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)
  }
}

import {Component, OnDestroy} from '@angular/core'
import {Options} from 'audiomotion-analyzer'
import {SettingsService} from '../../services/settings/settings.service'
import {ConnectionService} from '../../services/connection/connection.service'
import {faAngleLeft, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'
import {faSave} from '@fortawesome/free-solid-svg-icons/faSave'
import {faFileDownload} from '@fortawesome/free-solid-svg-icons/faFileDownload'
import {ColorService} from '../../services/color/color.service'
import iro from '@jaames/iro'
import {LoremIpsum} from 'lorem-ipsum'
import {GradientInformation, GradientInformationExtended} from '@angulon/interfaces'


@Component({
  selector: 'app-gradient-editor-page',
  templateUrl: './gradient-editor-page.component.html',
  styleUrls: ['./gradient-editor-page.component.scss'],
})
export class GradientEditorPageComponent implements OnDestroy {
  visualizerOptions: Options = {}

  // Gradient definitions
  gradients: GradientInformationExtended[] = []
  saveIcon = faSave
  load = faFileDownload
  deleteIcon = faTrash
  collapseIcon = faAngleLeft
  currentActiveGradientID = 0

  private defaultSliderOptions = {
    animate: true,
    start: 0,
    range: {min: 0, max: 1},
    connect: [true, false],
  }
  addIcon = faPlus
  jsonEnabled = false
  readonly amountClickLimit = 10
  clicked = 0
  basicGradients: GradientInformation[] = []

  constructor(
    private connection: ConnectionService,
    private colorService: ColorService,
    private settingsService: SettingsService,
  ) {
    this.init()
  }

  ngOnDestroy(): void {
    this.gradients = []
  }

  changeGradient(gradient: GradientInformation): void {
    this.visualizerOptions.gradient = gradient?.name || 'classic'
    this.currentActiveGradientID = gradient.id

    this.settingsService.saveVisualizerOptions(this.visualizerOptions)
    this.updateOptions()
  }

  changeShowScale(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.visualizerOptions.showScaleX = !!(+value & 1)
    this.visualizerOptions.showScaleY = !!(+value & 2)
    this.updateOptions()
  }

  loadOptions(): void {
    setTimeout(() => {
      this.visualizerOptions = {
        ...this.settingsService.readVisualizerOptions(),
      }
    }, 50)
  }

  saveOptions(): void {
    this.settingsService.saveVisualizerOptions(this.visualizerOptions)
  }

  private async getGradients(gradientsPreFetched?: GradientInformation[]): Promise<void> {
    const gradients = (gradientsPreFetched || await this.connection.getGradients()) as GradientInformationExtended[]
    for (const gradient of gradients) {
      gradient.sliderOptions = this.defaultSliderOptions
      gradient.collapsed = true
    }
    this.gradients = gradients
  }

  private init(): void {
    this.getGradients().then(() => {
      this.loadOptions()
    })
  }


  updateOptions(): void {
    this.visualizerOptions = Object.assign({}, this.visualizerOptions)
    this.saveOptions()
  }

  submitGradient(gradient: GradientInformationExtended) {
    this.updateGradients()
    this.updateOptions()
    this.connection.editGradient(gradient).then(() => this.changeGradient(gradient))
  }

  removeGradient(gradient: GradientInformationExtended): void {
    if (this.currentActiveGradientID == gradient.id) return

    this.connection.removeGradient(gradient).then((gradients => this.getGradients(gradients))).then(() => {
      this.changeGradient(this.gradients[0])
    })
  }

  removeColorStop(gradient: GradientInformationExtended, stopIndex: number) {
    if (gradient.colorStops.length <= 2) return

    gradient.colorStops.splice(stopIndex, 1)
  }

  handleCollapsable(gradient: GradientInformationExtended) {
    for (const gradientElement of this.gradients) {
      if (gradient.id !== gradientElement.id) gradientElement.collapsed = true
    }

    gradient.collapsed = !gradient.collapsed
    this.changeGradient(gradient)
    this.updateOptions()
  }

  addColorStopToGradient(gradient: GradientInformationExtended) {
    const lastColorstop = (gradient.colorStops[gradient.colorStops.length - 1] as any)

    const newPos = lastColorstop.pos + 0.1 > 1 ? 1 : lastColorstop.pos + 0.1
    gradient.colorStops.push({pos: newPos, color: '#FFF'})
    lastColorstop.pos -= 0.1
  }

  changeStopColor(newColor: iro.Color, gradient: GradientInformationExtended, stopIndex: number) {
    (gradient.colorStops[stopIndex] as any).color = newColor.hexString
    this.updateOptions()
  }

  handleClickOnHeader() {
    this.clicked++
    this.jsonEnabled = this.clicked >= this.amountClickLimit

    if (this.jsonEnabled) {
      this.basicGradients = this.gradients
      for (const basicGradient of this.basicGradients as GradientInformationExtended[]) {
        delete basicGradient.sliderOptions
        delete basicGradient.collapsed
      }
    }
  }

  updateGradients(): void {
    this.gradients = [...this.gradients]
  }

  changeBackgroundColor(newColor: iro.Color, gradient: GradientInformationExtended) {
    gradient.bgColor = newColor.hexString

    this.updateGradients()
  }

  addGradient() {
    const loremIpsumName = new LoremIpsum().generateWords(1)
    const newGradient: GradientInformationExtended = {
      id: Math.floor(Math.random() * 1000),
      name: loremIpsumName,
      dir: 'h',
      sliderOptions: this.defaultSliderOptions,
      collapsed: true,
      colorStops: [
        {pos: 0, color: '#fff'},
        {pos: 1, color: '#ff0000'},
      ],
      bgColor: '#000',
    }
    this.gradients.unshift(newGradient)
    this.updateGradients()
    this.connection.addGradient(newGradient).then((gradients) => {
      return this.getGradients(gradients)
    }).then(() => this.changeGradient(newGradient))
  }

  onNameChange(innerHTML: EventTarget, gradient: GradientInformationExtended) {
    gradient.name = (innerHTML as HTMLElement).innerHTML
  }
}

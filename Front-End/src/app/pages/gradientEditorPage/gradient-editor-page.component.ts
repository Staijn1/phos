import { Component, OnDestroy } from '@angular/core'
import { Options } from 'audiomotion-analyzer'
import { SettingsService } from '../../services/settings/settings.service'
import { GradientInformation, GradientInformationExtended } from '../../shared/types/GradientInformation'
import { ConnectionService } from '../../services/connection/connection.service'
import { faAngleLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons/faFileDownload'
import { ColorService } from '../../services/color/color.service'
import iro from '@jaames/iro'

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


  private defaultSliderOptions = {
    animate: true,
    start: 0,
    range: { min: 0, max: 1 },
    connect: [true, false],
  }
  addIcon = faPlus
  jsonEnabled: boolean = false
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
    this.gradients = undefined
  }

  changeGradient(gradient: number | string): void {
    if (typeof gradient === 'number') this.visualizerOptions.gradient = this.gradients[gradient].name
    else if (typeof  gradient === 'string') this.visualizerOptions.gradient = gradient

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

  private async getGradients(): Promise<void> {
    const gradients = await this.connection.getGradients() as GradientInformationExtended[]
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
  }

  submitGradient(gradient: GradientInformationExtended) {
    this.changeGradient(gradient.name)
    this.updateOptions()
    this.connection.editGradient(gradient).then()
  }

  removeGradient(gradient: GradientInformationExtended): void {
    this.connection.removeGradient(gradient).then()
    const gradientIndex = this.gradients.findIndex((value => {
      return value.name == gradient.name
    }))
    this.gradients.splice(gradientIndex, 1)
    this.changeGradient(gradientIndex)
  }

  removeColorStop(gradient: GradientInformationExtended, stopIndex: number) {
    if (gradient.colorStops.length <= 2) return

    gradient.colorStops.splice(stopIndex, 1)
  }

  handleCollapsable(gradient: GradientInformationExtended) {
    gradient.collapsed = !gradient.collapsed
    this.changeGradient(gradient.name)
    this.updateOptions()
  }

  addColorStopToGradient(gradient: GradientInformationExtended) {
    const lastColorstop = (gradient.colorStops[gradient.colorStops.length - 1] as any)

    const newPos = lastColorstop.pos + 0.1 > 1 ? 1 : lastColorstop.pos + 0.1
    gradient.colorStops.push({ pos: newPos, color: '#FFF' })
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

  updateGradients():void{
    this.gradients = [...this.gradients]
  }
  changeBackgroundColor(newColor: iro.Color, gradient: GradientInformationExtended) {
    gradient.bgColor = newColor.hexString

    this.updateGradients()
  }
}

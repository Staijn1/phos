import { Component, OnInit } from '@angular/core'
import AudioMotionAnalyzer, { Options } from 'audiomotion-analyzer'
import { SettingsService } from '../../services/settings/settings.service'
import { GradientInformation, GradientInformationExtended } from '../../shared/types/GradientInformation'
import { ConnectionService } from '../../services/connection/connection.service'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'
import { faFileDownload } from '@fortawesome/free-solid-svg-icons/faFileDownload'
import { ColorService } from '../../services/color/color.service'
import { ChromaEffectService } from '../../services/chromaEffect/chroma-effect.service'

@Component({
  selector: 'app-gradient-editor-page',
  templateUrl: './gradient-editor-page.component.html',
  styleUrls: ['./gradient-editor-page.component.scss'],
})
export class GradientEditorPageComponent implements OnInit {
  visualizerOptions: Options = {}

  // Gradient definitions
  gradients: GradientInformation[] = []
  saveIcon = faSave
  load = faFileDownload
  deleteIcon = faTrash
  editIcon = faEdit

  private defaultSliderOptions = {
    animate: true,
    start: 0,
    range: { min: 0, max: 1 },
    connect: [true, false],
  }
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

  ngOnInit(): void {
  }

  changeGradient(gradientIndex: number): void {
    this.visualizerOptions.gradient = this.gradients[gradientIndex].name
    this.updateOptions()
  }

  changeReflex(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.visualizerOptions.mirror = 0

    switch (+value) {
      case 1:
        this.visualizerOptions.reflexRatio = .4
        this.visualizerOptions.reflexAlpha = .2
        break
      case 2:
        this.visualizerOptions.reflexRatio = .5
        this.visualizerOptions.reflexAlpha = 1
        break
      default:
        this.visualizerOptions.reflexRatio = 0
    }

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
}

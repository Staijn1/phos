import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import iro from '@jaames/iro'
import {IroColorPicker} from '@jaames/iro/dist/ColorPicker'
import {SettingsService} from "../../services/settings/settings.service";
import Color = iro.Color;
import {ChromaEffectService} from "../../services/chromaEffect/chroma-effect.service";
import {LedstripCommandService} from "../../services/ledstrip-command/ledstrip-command.service";

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
})
export class ColorpickerComponent implements OnInit {
  @Input() color!: string[]
  @Output() colorChange = new EventEmitter<Color>()
  private picker!: IroColorPicker

  constructor(private readonly settingsService: SettingsService, private chromaEffect: ChromaEffectService, private connection: LedstripCommandService,) {
  }

  ngOnInit(): void {
    const currentSettings = this.settingsService.readGeneralSettings()
    try {
      this.picker = iro.ColorPicker('#colorpicker', {
        width: 150,
        layoutDirection: 'horizontal',
        handleRadius: 8,
        borderWidth: 2,
        borderColor: '#fff',
        wheelAngle: 90,
        color: currentSettings.colors[0],
      })
      this.picker.on('color:init', (iroColor: iro.Color) => {
        if (this.settingsService.readGeneralSettings().initialColor) {
          this.connection.setColor(this.picker.colors)
        }
        this.chromaEffect.setColors = this.picker.colors
      })
      this.picker.on('color:change', (iroColor: iro.Color) => {
        this.connection.setColor(this.picker.colors)
        this.chromaEffect.setColors = this.picker.colors
      })
      this.picker.on('input:end', (iroColor: iro.Color) => {
        const settings = this.settingsService.readGeneralSettings()
        settings.colors = this.settingsService.convertColors(this.picker.colors)
        this.settingsService.saveGeneralSettings(settings)
      })

    } catch (e) {
      console.error(`Colorpicker creation failed for #colorpicker. Reason: `, e)
    }
  }

}

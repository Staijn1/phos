import {Inject, Injectable} from '@angular/core'
import {DOCUMENT} from '@angular/common'
import iro from '@jaames/iro'
import {ChromaEffectService} from '../chromaEffect/chroma-effect.service'
import {SettingsService} from '../settings/settings.service'
import {ConnectionService} from '../connection/connection.service'

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  picker: any;

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument,
    private connection: ConnectionService,
    private settingsService: SettingsService,
    private chromaEffect: ChromaEffectService) {
    const currentSettings = this.settingsService.readGeneralSettings()
    setTimeout(() => {
      this.picker = iro.ColorPicker('#picker', {
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
      this.picker.on('input:end', (iroColor) => {
        const currentSettings = this.settingsService.readGeneralSettings()
        currentSettings.colors = this.settingsService.convertColors(this.picker.colors)
        this.settingsService.saveGeneralSettings(currentSettings)
      })
      this.setTheme(currentSettings.theme)
    }, 1)
  }

  get getFirstColorString(): string {
    return this.picker.colors[0].hexString
  }

  get getSecondColorString(): string {
    return this.picker.colors[1].hexString
  }

  get getThirdColorString(): string {
    return this.picker.colors[2].hexString
  }

  get getColors(): iro.Color[] {
    return this.picker.colors
  }

  setTheme(theme: string): void {
    if (!theme || theme === '') return
    this.document.body.className = theme
  }
}

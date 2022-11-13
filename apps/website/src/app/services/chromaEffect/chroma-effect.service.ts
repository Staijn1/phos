import {Injectable} from '@angular/core'
import {ChromaSDKService} from '../chromaSDK/chromaSDK.service'
import {State} from './state/abstract/state'
import {StaticState} from './state/static-state/static-state'
import {SettingsService} from '../settings/settings.service'
import iro from '@jaames/iro'
import {VisualizerState} from './state/visualizer-state/visualizer-state'

@Injectable({
    providedIn: 'root'
})
export class ChromaEffectService extends ChromaSDKService {
    _setColors: iro.Color[];
    private _state: State;
    private _speed = 1000;

    constructor(settingsService: SettingsService) {
        super(settingsService)
        this._state = new StaticState()
        this._state.context = this
    }

    set setColors(newColors: iro.Color[]) {
        this._setColors = newColors
        this.update()
    }

    private update(): void {
        this._state.handle(this._setColors)
    }

    set state(state: State) {
        this._state.onExit()
        this._state = state
        this._state.context = this
        this._state.onEntry()
        this.update()
    }

    set intensity(value: number) {
        if (this._state instanceof VisualizerState) {
            this._state.intensity = value
            this.update()
        }
    }

    set speed(value: number) {
        if (value > 0) {
            this._speed = value
            this.update()
        }
    }

    get speed(): number {
        return this._speed
    }
}

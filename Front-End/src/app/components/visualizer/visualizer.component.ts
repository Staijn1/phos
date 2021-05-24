import {Component, OnDestroy, OnInit} from '@angular/core';
import AudioMotionAnalyzer, {GradientOptions, Options} from 'audiomotion-analyzer';
import {ColorService} from '../../services/color/color.service';
import {faExpand} from '@fortawesome/free-solid-svg-icons/faExpand';
import {faSave} from '@fortawesome/free-solid-svg-icons/faSave';
import {faFileDownload} from '@fortawesome/free-solid-svg-icons/faFileDownload';
import {faLightbulb} from '@fortawesome/free-solid-svg-icons';
import {ChromaEffectService} from '../../services/chromaEffect/chroma-effect.service';
import {VisualizerState} from '../../services/chromaEffect/state/visualizer-state/visualizer-state';
import {SettingsService} from '../../services/settings/settings.service';
import {ConnectionService} from '../../services/connection/connection.service';
import {TimelineMax} from 'gsap';

interface Gradients extends GradientOptions {
    name: string;
    disabled: boolean;
}

@Component({
    selector: 'app-visualizer',
    templateUrl: './visualizer.component.html',
    styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit, OnDestroy {
    options: Options = {...this.settingsService.readVisualizerOptions(), ...{gradient: 'rainbow', volume: 0, onCanvasDraw: this.drawCallback.bind(this)}};
    presets = {
        default: {
            mode: 0,	// discrete frequencies
            fftSize: 8192,
            freqMin: 20,
            freqMax: 22000,
            smoothing: 0.5,
            gradient: 'prism',
            background: 0,	// gradient default
            cycleGrad: 1,
            randomMode: 0,
            ledDisplay: 0,
            lumiBars: 0,
            sensitivity: 1,
            showScale: 1,
            showPeaks: 1,
            showSong: 1,
            repeat: 0,
            noShadow: 1,
            loRes: 0,
            showFPS: 0,
            lineWidth: 2,
            fillAlpha: 0.1,
            barSpace: 0.1,
            reflex: 0,
            bgImageDim: 0.3,
            bgImageFit: 1, 	// center
            radial: 0,
            spin: 2
        },

        fullres: {
            fftSize: 8192,
            freqMin: 20,
            freqMax: 22000,
            mode: 0,
            radial: 0,
            randomMode: 0,
            reflex: 0,
            smoothing: 0.5
        },

        octave: {
            barSpace: 0.1,
            ledDisplay: 0,
            lumiBars: 0,
            mode: 3,	// 1/8th octave bands mode
            radial: 0,
            randomMode: 0,
            reflex: 0
        },

        ledbars: {
            background: 0,
            barSpace: 0.5,
            ledDisplay: 1,
            lumiBars: 0,
            mode: 3,
            radial: 0,
            randomMode: 0,
            reflex: 0
        },

        demo: {
            cycleGrad: 1,
            randomMode: 6    // 15 seconds
        }
    };
    // Gradient definitions
    gradients: Gradients[] = [
        {
            name: 'Apple',
            bgColor: '#111',
            colorStops: [
                {pos: .1667, color: '#61bb46'},
                {pos: .3333, color: '#fdb827'},
                {pos: .5, color: '#f5821f'},
                {pos: .6667, color: '#e03a3e'},
                {pos: .8333, color: '#963d97'},
                {pos: 1, color: '#009ddc'}
            ],
            disabled: false
        },
        {
            name: 'Aurora', bgColor: '#0e172a', colorStops: [
                {pos: .1, color: 'hsl( 120, 100%, 50% )'},
                {pos: 1, color: 'hsl( 216, 100%, 50% )'}
            ], disabled: false
        },
        {
            name: 'Borealis', bgColor: '#0d1526', colorStops: [
                {pos: .1, color: 'hsl( 120, 100%, 50% )'},
                {pos: .5, color: 'hsl( 189, 100%, 40% )'},
                {pos: 1, color: 'hsl( 290, 60%, 40% )'}
            ], disabled: false

        },
        {
            name: 'Candy', bgColor: '#0d0619', colorStops: [
                {pos: .1, color: '#ffaf7b'},
                {pos: .5, color: '#d76d77'},
                {pos: 1, color: '#3a1c71'}
            ], disabled: false
        },
        {
            name: 'Cool', bgColor: '#0b202b', colorStops: [
                'hsl( 208, 0%, 100% )',
                'hsl( 208, 100%, 35% )'
            ], disabled: false
        },
        {
            name: 'Dusk', bgColor: '#0e172a', colorStops: [
                {pos: .2, color: 'hsl( 55, 100%, 50% )'},
                {pos: 1, color: 'hsl( 16, 100%, 50% )'}
            ], disabled: false

        },
        {
            name: 'Miami', bgColor: '#110a11', colorStops: [
                {pos: .024, color: 'rgb( 251, 198, 6 )'},
                {pos: .283, color: 'rgb( 224, 82, 95 )'},
                {pos: .462, color: 'rgb( 194, 78, 154 )'},
                {pos: .794, color: 'rgb( 32, 173, 190 )'},
                {pos: 1, color: 'rgb( 22, 158, 95 )'}
            ], disabled: false

        },
        {
            name: 'Orient', bgColor: '#100', colorStops: [
                {pos: .1, color: '#f00'},
                {pos: 1, color: '#600'}
            ], disabled: false
        },
        {
            name: 'Outrun', bgColor: '#101', colorStops: [
                {pos: 0, color: 'rgb( 255, 223, 67 )'},
                {pos: .182, color: 'rgb( 250, 84, 118 )'},
                {pos: .364, color: 'rgb( 198, 59, 243 )'},
                {pos: .525, color: 'rgb( 133, 80, 255 )'},
                {pos: .688, color: 'rgb( 74, 104, 247 )'},
                {pos: 1, color: 'rgb( 35, 210, 255 )'}
            ], disabled: false
        },
        {
            name: 'Pacific Dream', bgColor: '#051319', colorStops: [
                {pos: .1, color: '#34e89e'},
                {pos: 1, color: '#0f3443'}
            ], disabled: false
        },
        {
            name: 'Shahabi', bgColor: '#060613', colorStops: [
                {pos: .1, color: '#66ff00'},
                {pos: 1, color: '#a80077'}
            ], disabled: false
        },
        {
            name: 'Summer', bgColor: '#041919', colorStops: [
                {pos: .1, color: '#fdbb2d'},
                {pos: 1, color: '#22c1c3'}
            ], disabled: false
        },
        {
            name: 'Sunset', bgColor: '#021119', colorStops: [
                {pos: .1, color: '#f56217'},
                {pos: 1, color: '#0b486b'}
            ], disabled: false
        },
        {
            name: 'Tie Dye', bgColor: '#111', colorStops: [
                {pos: .038, color: 'rgb( 15, 209, 165 )'},
                {pos: .208, color: 'rgb( 15, 157, 209 )'},
                {pos: .519, color: 'rgb( 133, 13, 230 )'},
                {pos: .731, color: 'rgb( 230, 13, 202 )'},
                {pos: .941, color: 'rgb( 242, 180, 107 )'}
            ], disabled: false
        },
        {
            name: 'Clouds', bgColor: '#212224', colorStops: [
                {pos: 0.731, color: '#2b4051'},
                {pos: 0.519, color: '#3F5567'},
                {pos: 0.208, color: '#A7B8BE'}
            ], disabled: false
        }
    ];
    // Visualization modes
    modes = [
        {value: 0, text: 'Discrete frequencies', disabled: false},
        {value: 10, text: 'Area graph', disabled: false},
        {value: 11, text: 'Line graph', disabled: false},
        {value: 1, text: '1/24th octave bands', disabled: false},
        {value: 2, text: '1/12th octave bands', disabled: false},
        {value: 3, text: '1/8th octave bands', disabled: false},
        {value: 4, text: '1/6th octave bands', disabled: false},
        {value: 5, text: '1/4th octave bands', disabled: false},
        {value: 6, text: '1/3rd octave bands', disabled: false},
        {value: 7, text: 'Half octave bands', disabled: false},
        {value: 8, text: 'Full octave bands', disabled: false},
    ];
    // Properties that may be changed by Random Mode
    randomProperties = [
        {value: 'nobg', text: 'Background', disabled: false},
        {value: 'imgfit', text: 'Image Fit', disabled: false},
        {value: 'reflex', text: 'Reflex', disabled: false},
        {value: 'peaks', text: 'PEAKS', disabled: false},
        {value: 'leds', text: 'LEDS', disabled: false},
        {value: 'lumi', text: 'LUMI', disabled: false},
        {value: 'barSp', text: 'Bar Spacing', disabled: false},
        {value: 'line', text: 'Line Width', disabled: false},
        {value: 'fill', text: 'Fill Opacity', disabled: false},
        {value: 'radial', text: 'Radial', disabled: false},
        {value: 'spin', text: 'Spin', disabled: false}
    ];
    smoothingConfig = {
        connect: 'lower',
        start: this.options.smoothing,
        step: 0.1,
        range: {
            min: 0,
            max: 0.9
        },
    };
    frequencyLimits = [this.options.minFreq, this.options.maxFreq];
    frequencyLimitsConfig = {
        behaviour: 'drag',
        connect: true,
        start: [this.options.minFreq, this.options.maxFreq],
        range: {
            min: 20,
            max: 22000
        },
        step: 10,
    };
    spinSpeedConfig = {
        connect: 'lower',
        start: this.options.spinSpeed,
        step: 1,
        range: {
            min: 0,
            max: 50
        },
    };
    fullscreenIcon = faExpand;
    lineWidthConfig = {
        connect: 'lower',
        start: this.options.lineWidth,
        step: 1,
        range: {
            min: 1,
            max: 5
        },
    };
    bgAlphaConfig = {
        connect: 'lower',
        start: this.options.fillAlpha,
        step: 0.1,
        range: {
            min: 0,
            max: 1
        },
    };
    save = faSave;
    load = faFileDownload;
    modeIcon = faLightbulb;
    private audioMotion: AudioMotionAnalyzer;
    private timeline: TimelineMax;

    constructor(
        private connection: ConnectionService,
        private colorService: ColorService,
        private settingsService: SettingsService,
        private chromaEffect: ChromaEffectService) {
    }

    ngOnDestroy(): void {
        this.audioMotion.toggleAnalyzer();
    }

    ngOnInit(): void {
        this.init();
        this.chromaEffect.state = new VisualizerState();

        this.timeline = new TimelineMax();
        if (localStorage.getItem('dismissedSettingsPopup') !== 'true') {
            this.timeline.to('#overlay', {duration: 1, opacity: 1}, '+=1.8');
        }
    }

    updateLedstrip(): void {
        this.connection.setMode(55);
        this.connection.setColor(this.colorService.getColors);
    }

    drawCallback(instance: AudioMotionAnalyzer): void {
        const value = instance.getEnergy('bass');
        this.connection.setLeds(value);
        this.chromaEffect.intensity = value;
    }

    updateOptions(): void {
        this.audioMotion.setOptions(this.options);
    }

    changeGradient(gradientIndex: number): void {
        this.options.gradient = this.gradients[gradientIndex].name;
        this.updateOptions();
    }

    changeReflex(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        switch (+value) {
            case 1:
                this.options.reflexRatio = .4;
                this.options.reflexAlpha = .2;
                break;

            case 2:
                this.options.reflexRatio = .5;
                this.options.reflexAlpha = 1;
                break;

            default:
                this.options.reflexRatio = 0;
        }
        this.updateOptions();
    }

    fullscreen(): void {
        this.audioMotion.toggleFullscreen();
    }

    changeShowScale(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.options.showScaleX = !!(+value & 1);
        this.options.showScaleY = !!(+value & 2);
        this.updateOptions();
    }

    changeFrequencyLimit(): void {
        this.options.minFreq = this.frequencyLimits[0];
        this.options.maxFreq = this.frequencyLimits[1];
        this.updateOptions();
    }

    changeDisplay($event: Event): void {
        const element = $event.currentTarget as HTMLElement;

        this.options.showLeds = false;
        this.options.lumiBars = false;
        this.options.radial = false;

        if (element.id === 'leds') {
            this.options.showLeds = true;
        } else if (element.id === 'lumi') {
            this.options.lumiBars = true;
        } else if (element.id === 'radial') {
            this.options.radial = true;
        } else {
            throw Error('Unknown ID!');
        }
        this.updateOptions();
    }

    changeGeneralSettings($event: Event): void {
        const element = $event.target as HTMLInputElement;

        const value = element.checked;

        if (element.id === 'peaks') {
            this.options.showPeaks = value;
        } else if (element.id === 'lores') {
            this.options.loRes = value;
        } else if (element.id === 'fps') {
            this.options.showFPS = value;
        } else {
            throw Error('Unknown ID!');
        }
        this.updateOptions();
    }

    updateMode(event: Event): void {
        let value = +(event.target as HTMLInputElement).value;
        switch (+value) {
            case 10:
                this.options.lineWidth = 0;
                this.options.fillAlpha = 1;
                break;
            case 11:
                this.options.lineWidth = 5;
                this.options.fillAlpha = 0.1;
                value = 10;
                break;
        }

        this.options.mode = value;
        this.updateOptions();
    }

    loadOptions(): void {
        this.options = this.settingsService.readVisualizerOptions();
    }

    saveOptions(): void {
        this.settingsService.saveVisualizerOptions(this.options);
    }

    private setSource(): void {
        navigator.mediaDevices.getUserMedia({audio: true, video: false})
            .then(stream => {
                const audioCtx = this.audioMotion.audioCtx;
                const micInput = audioCtx.createMediaStreamSource(stream);
                this.audioMotion.disconnectInput();
                this.audioMotion.connectInput(micInput);
            })
            .catch(err => {
                console.error(`Could not change audio source - ${err}`, err);
            });
    }

    private registerGradients(): void {
        this.gradients.forEach((gradient, index: number) => {
            this.audioMotion.registerGradient(gradient.name, {
                bgColor: gradient.bgColor,
                colorStops: gradient.colorStops
            } as GradientOptions);
        });
    }

    private init(): void {
        const elem = document.getElementById('visualizer');

        this.audioMotion = new AudioMotionAnalyzer(
            elem,
            this.options
        );
        this.setSource();
        this.registerGradients();
        this.loadOptions();
        setTimeout(() => {
            this.updateLedstrip();
        }, 2000);
    }

    scroll(el: HTMLDivElement): void {
        el.scrollIntoView({behavior: 'smooth'});
    }

    dismissOverlay(): void {
        this.timeline.to('#overlay', {duration: 1, opacity: 0});
        this.timeline.to('#overlay', {duration: 0.5, visibility: 'hidden'});
        localStorage.setItem('dismissedSettingsPopup', 'true');
    }
}

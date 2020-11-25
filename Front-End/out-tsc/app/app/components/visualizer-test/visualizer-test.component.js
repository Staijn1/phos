"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualizerTestComponent = void 0;
var core_1 = require("@angular/core");
var audiomotion_analyzer_1 = require("audiomotion-analyzer");
var serial_connection_service_1 = require("../../services/serial/serial-connection.service");
var color_service_1 = require("../../services/color/color.service");
var faWrench_1 = require("@fortawesome/free-solid-svg-icons/faWrench");
var faExpand_1 = require("@fortawesome/free-solid-svg-icons/faExpand");
var file_service_1 = require("../../services/file/file.service");
var faSave_1 = require("@fortawesome/free-solid-svg-icons/faSave");
var faFileDownload_1 = require("@fortawesome/free-solid-svg-icons/faFileDownload");
var VisualizerTestComponent = /** @class */ (function () {
    function VisualizerTestComponent(serialService, colorService, fileService) {
        this.serialService = serialService;
        this.colorService = colorService;
        this.fileService = fileService;
        this.options = {
            barSpace: 0.1,
            bgAlpha: 0.7,
            fftSize: 8192,
            fillAlpha: 1,
            gradient: 'classic',
            lineWidth: 0,
            loRes: false,
            lumiBars: false,
            maxDecibels: -25,
            maxFreq: 22000,
            minDecibels: -85,
            minFreq: 20,
            mode: 2,
            // @ts-ignore
            onCanvasDraw: this.drawCallback.bind(this),
            overlay: false,
            radial: false,
            reflexAlpha: 0.15,
            reflexBright: 1,
            reflexFit: true,
            reflexRatio: 0,
            showBgColor: true,
            showFPS: false,
            showLeds: false,
            showPeaks: true,
            showScale: false,
            showScaleY: false,
            smoothing: 0.7,
            spinSpeed: 0,
            start: true,
        };
        this.presets = {
            default: {
                mode: 0,
                fftSize: 8192,
                freqMin: 20,
                freqMax: 22000,
                smoothing: 0.5,
                gradient: 'prism',
                background: 0,
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
                bgImageFit: 1,
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
                mode: 3,
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
                randomMode: 6 // 15 seconds
            }
        };
        // Gradient definitions
        this.gradients = [
            {
                name: 'Apple', bgColor: '#111', colorStops: [
                    { pos: .1667, color: '#61bb46' },
                    { pos: .3333, color: '#fdb827' },
                    { pos: .5, color: '#f5821f' },
                    { pos: .6667, color: '#e03a3e' },
                    { pos: .8333, color: '#963d97' },
                    { pos: 1, color: '#009ddc' }
                ], disabled: false
            },
            {
                name: 'Aurora', bgColor: '#0e172a', colorStops: [
                    { pos: .1, color: 'hsl( 120, 100%, 50% )' },
                    { pos: 1, color: 'hsl( 216, 100%, 50% )' }
                ], disabled: false
            },
            {
                name: 'Borealis', bgColor: '#0d1526', colorStops: [
                    { pos: .1, color: 'hsl( 120, 100%, 50% )' },
                    { pos: .5, color: 'hsl( 189, 100%, 40% )' },
                    { pos: 1, color: 'hsl( 290, 60%, 40% )' }
                ], disabled: false
            },
            {
                name: 'Candy', bgColor: '#0d0619', colorStops: [
                    { pos: .1, color: '#ffaf7b' },
                    { pos: .5, color: '#d76d77' },
                    { pos: 1, color: '#3a1c71' }
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
                    { pos: .2, color: 'hsl( 55, 100%, 50% )' },
                    { pos: 1, color: 'hsl( 16, 100%, 50% )' }
                ], disabled: false
            },
            {
                name: 'Miami', bgColor: '#110a11', colorStops: [
                    { pos: .024, color: 'rgb( 251, 198, 6 )' },
                    { pos: .283, color: 'rgb( 224, 82, 95 )' },
                    { pos: .462, color: 'rgb( 194, 78, 154 )' },
                    { pos: .794, color: 'rgb( 32, 173, 190 )' },
                    { pos: 1, color: 'rgb( 22, 158, 95 )' }
                ], disabled: false
            },
            {
                name: 'Orient', bgColor: '#100', colorStops: [
                    { pos: .1, color: '#f00' },
                    { pos: 1, color: '#600' }
                ], disabled: false
            },
            {
                name: 'Outrun', bgColor: '#101', colorStops: [
                    { pos: 0, color: 'rgb( 255, 223, 67 )' },
                    { pos: .182, color: 'rgb( 250, 84, 118 )' },
                    { pos: .364, color: 'rgb( 198, 59, 243 )' },
                    { pos: .525, color: 'rgb( 133, 80, 255 )' },
                    { pos: .688, color: 'rgb( 74, 104, 247 )' },
                    { pos: 1, color: 'rgb( 35, 210, 255 )' }
                ], disabled: false
            },
            {
                name: 'Pacific Dream', bgColor: '#051319', colorStops: [
                    { pos: .1, color: '#34e89e' },
                    { pos: 1, color: '#0f3443' }
                ], disabled: false
            },
            {
                name: 'Shahabi', bgColor: '#060613', colorStops: [
                    { pos: .1, color: '#66ff00' },
                    { pos: 1, color: '#a80077' }
                ], disabled: false
            },
            {
                name: 'Summer', bgColor: '#041919', colorStops: [
                    { pos: .1, color: '#fdbb2d' },
                    { pos: 1, color: '#22c1c3' }
                ], disabled: false
            },
            {
                name: 'Sunset', bgColor: '#021119', colorStops: [
                    { pos: .1, color: '#f56217' },
                    { pos: 1, color: '#0b486b' }
                ], disabled: false
            },
            {
                name: 'Tie Dye', bgColor: '#111', colorStops: [
                    { pos: .038, color: 'rgb( 15, 209, 165 )' },
                    { pos: .208, color: 'rgb( 15, 157, 209 )' },
                    { pos: .519, color: 'rgb( 133, 13, 230 )' },
                    { pos: .731, color: 'rgb( 230, 13, 202 )' },
                    { pos: .941, color: 'rgb( 242, 180, 107 )' }
                ], disabled: false
            },
            {
                name: 'Lissa', bgColor: '#08051f', colorStops: [
                    'rgb( 230, 13, 202 )',
                    'rgb(34,3,34)'
                ], disabled: false
            }
        ];
        // Visualization modes
        this.modes = [
            { value: 0, text: 'Discrete frequencies', disabled: false },
            { value: 10, text: 'Area graph', disabled: false },
            { value: 11, text: 'Line graph', disabled: false },
            { value: 1, text: '1/24th octave bands', disabled: false },
            { value: 2, text: '1/12th octave bands', disabled: false },
            { value: 3, text: '1/8th octave bands', disabled: false },
            { value: 4, text: '1/6th octave bands', disabled: false },
            { value: 5, text: '1/4th octave bands', disabled: false },
            { value: 6, text: '1/3rd octave bands', disabled: false },
            { value: 7, text: 'Half octave bands', disabled: false },
            { value: 8, text: 'Full octave bands', disabled: false },
        ];
        // Properties that may be changed by Random Mode
        this.randomProperties = [
            { value: 'nobg', text: 'Background', disabled: false },
            { value: 'imgfit', text: 'Image Fit', disabled: false },
            { value: 'reflex', text: 'Reflex', disabled: false },
            { value: 'peaks', text: 'PEAKS', disabled: false },
            { value: 'leds', text: 'LEDS', disabled: false },
            { value: 'lumi', text: 'LUMI', disabled: false },
            { value: 'barSp', text: 'Bar Spacing', disabled: false },
            { value: 'line', text: 'Line Width', disabled: false },
            { value: 'fill', text: 'Fill Opacity', disabled: false },
            { value: 'radial', text: 'Radial', disabled: false },
            { value: 'spin', text: 'Spin', disabled: false }
        ];
        this.smoothingConfig = {
            connect: 'lower',
            start: this.options.smoothing,
            step: 0.1,
            range: {
                'min': 0,
                'max': 0.9
            },
        };
        this.frequencyLimits = [this.options.minFreq, this.options.maxFreq];
        this.frequencyLimitsConfig = {
            behaviour: 'drag',
            connect: true,
            start: [this.options.minFreq, this.options.maxFreq],
            range: {
                min: 20,
                max: 22000
            },
            step: 10,
        };
        this.spinSpeedConfig = {
            connect: 'lower',
            start: this.options.spinSpeed,
            step: 1,
            range: {
                'min': 0,
                'max': 50
            },
        };
        this.settingIcon = faWrench_1.faWrench;
        this.fullscreenIcon = faExpand_1.faExpand;
        this.lineWidthConfig = {
            connect: 'lower',
            start: this.options.lineWidth,
            step: 1,
            range: {
                'min': 1,
                'max': 5
            },
        };
        this.bgAlphaConfig = {
            connect: 'lower',
            start: this.options.fillAlpha,
            step: 0.1,
            range: {
                'min': 0,
                'max': 1
            },
        };
        this.save = faSave_1.faSave;
        this.load = faFileDownload_1.faFileDownload;
    }
    VisualizerTestComponent.prototype.ngOnInit = function () {
        var _this = this;
        var elem = document.getElementById('visualizer');
        var analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 2048;
        analyserNode.maxDecibels = -25;
        analyserNode.minDecibels = -60;
        analyserNode.smoothingTimeConstant = 0.5;
        this.audioMotion = new audiomotion_analyzer_1.default(elem);
        // console.log(this.audioMotion)
        // this.setSource();
        // this.registerGradients();
        setTimeout(function () {
            _this.serialService.setMode(55);
        }, 2000);
    };
    VisualizerTestComponent.prototype.setSource = function () {
        /*
        navigator.mediaDevices.getUserMedia({audio: true, video: false})
            .then(stream => {
                console.log(this.audioMotion);
                /*
                this.sourceMic = this.audioMotion.audioCtx.createMediaStreamSource(stream);
                console.log('Audio source set to microphone');
                this.audioMotion.disconnect(this.audioMotion.audioCtx.destination); // avoid feedback loop
                this.sourceMic.connect(this.audioMotion.analyzer);
            */ /*
        })
        .catch(err => {
            console.log(`Could not change audio source - ${err}`, err);
        });*/
    };
    VisualizerTestComponent.prototype.drawCallback = function (instance) {
        // console.log(instance.dataarray[instance.freqToBin(155)])
        this.serialService.setLeds(this.map(instance._dataArray[instance.freqToBin(155)], 0, 255, 0, this.serialService.amountOfLeds));
    };
    VisualizerTestComponent.prototype.updateOptions = function () {
        /*
        this.audioMotion.setOptions(this.options)
        console.log(this.options)*/
    };
    VisualizerTestComponent.prototype.registerGradients = function () {
        var _this = this;
        this.gradients.forEach(function (gradient, index) {
            _this.audioMotion.registerGradient(gradient.name, { bgColor: gradient.bgColor, colorStops: gradient.colorStops });
        });
    };
    VisualizerTestComponent.prototype.changeGradient = function (gradientIndex) {
        this.options.gradient = this.gradients[gradientIndex].name;
        this.updateOptions();
    };
    VisualizerTestComponent.prototype.changeReflex = function (value) {
        console.log(typeof value);
        throw new Error('Not implemented!');
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
    };
    VisualizerTestComponent.prototype.fullscreen = function () {
        this.audioMotion.toggleFullscreen();
    };
    VisualizerTestComponent.prototype.changeShowScale = function (value) {
        this.options.showScale = !!(+value & 1);
        this.options.showScaleY = !!(+value & 2);
        this.updateOptions();
    };
    VisualizerTestComponent.prototype.map = function (input, in_min, in_max, out_min, out_max) {
        return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    };
    VisualizerTestComponent.prototype.changeFrequencyLimit = function () {
        this.options.minFreq = this.frequencyLimits[0];
        this.options.maxFreq = this.frequencyLimits[1];
        this.updateOptions();
    };
    VisualizerTestComponent.prototype.changeDisplay = function ($event) {
        var element = $event.currentTarget;
        this.options.showLeds = false;
        this.options.lumiBars = false;
        this.options.radial = false;
        if (element.id === 'leds') {
            this.options.showLeds = true;
        }
        else if (element.id === 'lumi') {
            this.options.lumiBars = true;
        }
        else if (element.id === 'radial') {
            this.options.radial = true;
        }
        else if (element.id === 'normal') {
        }
        else {
            throw Error('Unknown ID!');
        }
        this.updateOptions();
    };
    VisualizerTestComponent.prototype.changeGeneralSettings = function ($event) {
        var element = $event.target;
        var value = element.checked;
        if (element.id === 'peaks') {
            this.options.showPeaks = value;
        }
        else if (element.id === 'lores') {
            this.options.loRes = value;
        }
        else if (element.id === 'fps') {
            this.options.showFPS = value;
        }
        else {
            throw Error('Unknown ID!');
        }
        this.updateOptions();
    };
    VisualizerTestComponent.prototype.updateMode = function (value) {
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
    };
    VisualizerTestComponent.prototype.loadOptions = function () {
    };
    VisualizerTestComponent.prototype.saveOptions = function () {
    };
    VisualizerTestComponent = __decorate([
        core_1.Component({
            selector: 'app-visualizer-test',
            templateUrl: './visualizer-test.component.html',
            styleUrls: ['./visualizer-test.component.scss']
        }),
        __metadata("design:paramtypes", [serial_connection_service_1.SerialConnectionService, color_service_1.ColorService, file_service_1.FileService])
    ], VisualizerTestComponent);
    return VisualizerTestComponent;
}());
exports.VisualizerTestComponent = VisualizerTestComponent;
//# sourceMappingURL=visualizer-test.component.js.map
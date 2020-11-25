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
exports.VisualizerComponent = void 0;
require("assets/p5/addons/p5.sound.min");
var p5 = require("p5");
var serial_connection_service_1 = require("../../services/serial/serial-connection.service");
var core_1 = require("@angular/core");
var VisualizerComponent = /** @class */ (function () {
    function VisualizerComponent(serialService) {
        this.serialService = serialService;
        this.canvasHeight = 800;
        this.canvasWidth = 800;
    }
    VisualizerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var sketch = function (s) {
            s.preload = function () {
                _this.preload(s);
            };
            s.setup = function () {
                _this.setup(s);
            };
            s.draw = function () {
                _this.draw(s);
            };
        };
        var canvas = new p5(sketch);
    };
    VisualizerComponent.prototype.preload = function (s) {
    };
    VisualizerComponent.prototype.setup = function (s) {
        this.serialService.setMode(55);
        var c = document.querySelector('#sketch-holder');
        s.createCanvas(this.canvasWidth, this.canvasHeight).parent(c);
        this.fftprogram = new FFTProgram(512, 30);
        this.simplisticRectangleProgram = new SimplisticRectangleProgram(s, this.fftprogram);
        this.sendProgram = new SendProgram(s, 30, this.serialService);
    };
    VisualizerComponent.prototype.draw = function (s) {
        this.simplisticRectangleProgram.run();
        this.fftprogram.run();
        this.sendProgram.setValue(this.fftprogram.getBass());
        this.sendProgram.run();
    };
    VisualizerComponent = __decorate([
        core_1.Component({
            selector: 'app-visualizer',
            templateUrl: './visualizer.component.html',
            styleUrls: ['./visualizer.component.scss']
        }),
        __metadata("design:paramtypes", [serial_connection_service_1.SerialConnectionService])
    ], VisualizerComponent);
    return VisualizerComponent;
}());
exports.VisualizerComponent = VisualizerComponent;
var Rectangle = /** @class */ (function () {
    function Rectangle(s, x, y, width, height, rectColor, tl, tr, br, bl) {
        if (tl === void 0) { tl = 0; }
        if (tr === void 0) { tr = 0; }
        if (br === void 0) { br = 0; }
        if (bl === void 0) { bl = 0; }
        this.s = s;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rectColor = rectColor;
        this.tl = tl;
        this.tr = tr;
        this.br = br;
        this.bl = bl;
    }
    Rectangle.prototype.draw = function () {
        this.s.fill(this.rectColor);
        this.s.noStroke();
        this.s.rect(this.x, this.y, this.width, this.height, this.tl, this.tr, this.br, this.bl);
    };
    Rectangle.prototype.getHeight = function () {
        return this.height;
    };
    Rectangle.prototype.setHeight = function (height) {
        this.height = height;
        return this;
    };
    Rectangle.prototype.setWidth = function (width) {
        this.width = width;
        return this;
    };
    Rectangle.prototype.getWidth = function () {
        return this.width;
    };
    return Rectangle;
}());
var FFTProgram = /** @class */ (function () {
    function FFTProgram(amountOfBins, percentageNotToShow) {
        this.allAverages = [];
        this.amountOfBins = amountOfBins;
        var percentageToShow = (100 - percentageNotToShow) / 100;
        this.percentageNotToShow = percentageNotToShow;
        this.amountToShow = this.amountOfBins * percentageToShow;
        // Create mic input object.
        this.sound = new p5.AudioIn();
        // Start listening on mic.
        this.sound.start();
        // Create FFT object
        this.fft = new p5.FFT(0.85, this.amountOfBins);
        // Connect mic to fft
        this.sound.connect(this.fft);
        this.sound.amp(0.5);
        this.selectedBar = 1;
    }
    FFTProgram.prototype.run = function () {
        this.fft.analyze();
        this.allAverages = this.fft.linAverages(this.amountOfBins);
        this.bass = this.fft.getEnergy('bass');
        this.lowMid = this.fft.getEnergy('lowMid');
        this.mid = this.fft.getEnergy('mid');
        this.highMid = this.fft.getEnergy('highMid');
        this.treble = this.fft.getEnergy('treble');
    };
    FFTProgram.prototype.getAmountToShow = function () {
        return this.amountToShow;
    };
    FFTProgram.prototype.setAmountToShow = function (newAmountToShow) {
        this.amountToShow = newAmountToShow;
    };
    FFTProgram.prototype.setSelectedBar = function (newBar) {
        this.selectedBar = newBar;
    };
    FFTProgram.prototype.getSelectedBar = function () {
        return this.selectedBar;
    };
    FFTProgram.prototype.getBass = function () {
        return this.bass;
    };
    FFTProgram.prototype.getLowMid = function () {
        return this.lowMid;
    };
    FFTProgram.prototype.getMid = function () {
        return this.mid;
    };
    FFTProgram.prototype.getHighMid = function () {
        return this.highMid;
    };
    FFTProgram.prototype.getTreble = function () {
        return this.treble;
    };
    FFTProgram.prototype.getAllAverages = function () {
        return this.allAverages;
    };
    return FFTProgram;
}());
var SimplisticRectangleProgram = /** @class */ (function () {
    function SimplisticRectangleProgram(s, fftProgram) {
        this.rectangles = [];
        this.fftProgram = fftProgram;
        this.s = s;
        var colors = ['#e91e63', '#fdd835', '#4caf50', '#00bcd4', '#3f51b5'];
        for (var i = 0; i < 5; i++) {
            this.rectangles[i] = new Rectangle(s, s.width / 2, (this.s.height / 16 * i), 10, 10, colors[i]);
        }
    }
    SimplisticRectangleProgram.prototype.run = function () {
        this.s.push();
        this.s.background('#F8F8F8');
        this.s.noStroke();
        this.s.rectMode(this.s.CENTER);
        this.s.translate(0, this.s.height / 3);
        this.rectangles[0].setWidth(this.s.map(this.fftProgram.getBass(), 0, 255, 0, this.s.width));
        this.rectangles[1].setWidth(this.s.map(this.fftProgram.getLowMid(), 0, 255, 0, this.s.width));
        this.rectangles[2].setWidth(this.s.map(this.fftProgram.getMid(), 0, 255, 0, this.s.width));
        this.rectangles[3].setWidth(this.s.map(this.fftProgram.getHighMid(), 0, 255, 0, this.s.width));
        this.rectangles[4].setWidth(this.s.map(this.fftProgram.getTreble(), 0, 255, 0, this.s.width));
        for (var i = 0; i < this.rectangles.length; i++) {
            this.rectangles[i].draw();
        }
        this.s.pop();
    };
    return SimplisticRectangleProgram;
}());
var SendProgram = /** @class */ (function () {
    function SendProgram(s, amountOfLeds, serialService) {
        this.serialService = serialService;
        this.s = s;
        this.counter = 0;
        this.amountOfLeds = amountOfLeds;
    }
    SendProgram.prototype.run = function () {
        try {
            this.counter++;
            // todo check if counter can be removed when over serial
            if (this.counter % 5 === 0) {
                this.serialService.setLeds(this.s.floor(this.value));
                // tslint:disable-next-line:max-line-length
                // allEffects.createVisualizer(this.value, calculateBGRInteger(colorpicker.color.rgb.b, colorpicker.color.rgb.g, colorpicker.color.rgb.r), this.amountOfLeds, 0);
            }
            this.counter = this.counter % 100;
        }
        catch (e) {
            console.error(e);
        }
    };
    SendProgram.prototype.setValue = function (newValue) {
        this.value = this.s.map(newValue, 0, 255, 0, this.amountOfLeds);
        return this;
    };
    return SendProgram;
}());
//# sourceMappingURL=visualizer.component.js.map
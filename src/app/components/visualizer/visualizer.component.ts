import {Component, OnInit} from '@angular/core';
import * as p5 from 'p5';
import 'assets/p5/addons/p5.sound.min';
import {SerialConnectionService} from '../../services/serial/serial-connection.service';

@Component({
    selector: 'app-visualizer',
    templateUrl: './visualizer.component.html',
    styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit {
    private canvasHeight = 800;
    private canvasWidth = 800;
    private fftprogram: FFTProgram;
    private simplisticRectangleProgram: SimplisticRectangleProgram;
    private sendProgram: SendProgram;

    constructor(private serialService: SerialConnectionService) {
        this.serialService.openPort();

    }

    ngOnInit() {

        const sketch = (s) => {

            s.preload = () => {
                this.preload(s)
            }

            s.setup = () => {
                this.setup(s);
            };

            s.draw = () => {
                this.draw(s);
            };
        }

        const canvas = new p5(sketch);
    }

    private preload(s) {

    }

    private setup(s) {
        this.serialService.setMode(55);
        const c = document.querySelector('#sketch-holder');
        s.createCanvas(this.canvasWidth, this.canvasHeight).parent(c);

        this.fftprogram = new FFTProgram(512, 30);
        this.simplisticRectangleProgram = new SimplisticRectangleProgram(s, this.fftprogram);
        this.sendProgram = new SendProgram(s, 30, this.serialService);
    }

    private draw(s) {
        this.simplisticRectangleProgram.run();
        this.fftprogram.run();

        this.sendProgram.setValue(this.fftprogram.getBass());
        this.sendProgram.run();
    }
}

class Rectangle {
    private s: any;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private rectColor: any;
    private tl: number;
    private tr: number;
    private br: number;
    private bl: number;

    constructor(s, x, y, width, height, rectColor, tl = 0, tr = 0, br = 0, bl = 0) {
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

    draw() {
        this.s.fill(this.rectColor);
        this.s.noStroke();
        this.s.rect(this.x, this.y, this.width, this.height, this.tl, this.tr, this.br, this.bl);
    }

    getHeight() {
        return this.height;
    }

    setHeight(height) {
        this.height = height;
        return this;
    }

    setWidth(width) {
        this.width = width;
        return this;
    }

    getWidth() {
        return this.width;
    }
}

class FFTProgram {
    allAverages = [];
    bass;
    lowMid;
    mid;
    highMid;
    treble;

    selectedBar;
    sound;
    fft;
    amountToShow;
    private amountOfBins: number;
    private percentageNotToShow: number;

    constructor(amountOfBins, percentageNotToShow) {
        this.amountOfBins = amountOfBins;

        const percentageToShow = (100 - percentageNotToShow) / 100;
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

    run() {
        this.fft.analyze();
        this.allAverages = this.fft.linAverages(this.amountOfBins);
        this.bass = this.fft.getEnergy('bass');
        this.lowMid = this.fft.getEnergy('lowMid');
        this.mid = this.fft.getEnergy('mid');
        this.highMid = this.fft.getEnergy('highMid');
        this.treble = this.fft.getEnergy('treble');
    }

    getAmountToShow() {
        return this.amountToShow;
    }

    setAmountToShow(newAmountToShow) {
        this.amountToShow = newAmountToShow;
    }

    setSelectedBar(newBar) {
        this.selectedBar = newBar;
    }

    getSelectedBar() {
        return this.selectedBar;
    }

    getBass() {
        return this.bass;
    }

    getLowMid() {
        return this.lowMid;
    }

    getMid() {
        return this.mid;
    }

    getHighMid() {
        return this.highMid;
    }

    getTreble() {
        return this.treble;
    }

    getAllAverages() {
        return this.allAverages;
    }
}

class SimplisticRectangleProgram {
    rectangles = [];
    private fftProgram: FFTProgram;
    private s: any;

    constructor(s, fftProgram) {
        this.fftProgram = fftProgram;
        this.s = s;
        const colors = ['#e91e63', '#fdd835', '#4caf50', '#00bcd4', '#3f51b5'];
        for (let i = 0; i < 5; i++) {
            this.rectangles[i] = new Rectangle(s, s.width / 2, (this.s.height / 16 * i), 10, 10, colors[i]);
        }
    }

    run() {
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

        for (let i = 0; i < this.rectangles.length; i++) {
            this.rectangles[i].draw();
        }

        this.s.pop();
    }
}

class SendProgram {
    counter: number;
    amountOfLeds: number;
    value: number;
    private s: any;
    private serialService: SerialConnectionService;

    constructor(s, amountOfLeds, serialService: SerialConnectionService) {
        this.serialService = serialService;
        this.s = s;
        this.counter = 0;
        this.amountOfLeds = amountOfLeds;
    }

    run() {
        try {
            this.counter++;
            // todo check if counter can be removed when over serial
            if (this.counter % 5 === 0) {
                this.serialService.setLeds(this.s.floor(this.value));
                // tslint:disable-next-line:max-line-length
                // allEffects.createVisualizer(this.value, calculateBGRInteger(colorpicker.color.rgb.b, colorpicker.color.rgb.g, colorpicker.color.rgb.r), this.amountOfLeds, 0);
            }
            this.counter = this.counter % 100;
        } catch (e) {
            console.error(e);
        }
    }

    setValue(newValue) {
        this.value = this.s.map(newValue, 0, 255, 0, this.amountOfLeds);
        return this;
    }
}

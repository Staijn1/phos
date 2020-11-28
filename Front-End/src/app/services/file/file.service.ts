import {Injectable} from '@angular/core';
import {ElectronService} from '../electron/electron.service';

const ini = require('ini');

@Injectable({
    providedIn: 'root'
})
export class FileService {
    fs: any;
    private readonly fileUrl: string;

    constructor(private electronService: ElectronService) {
        this.fs = electronService.fs;

        let root = process.resourcesPath;
        let pathToSettings;
        if (root.includes('node_modules')) {
            root = root.split('node_modules')[0];
            pathToSettings = 'src/assets/settings.ini'
        } else {
            pathToSettings = '/app/src/assets/settings.ini';
        }

        console.log('fileUrl', root + pathToSettings);
        this.fileUrl = root + pathToSettings;
        // const path = this.electronService.path.resolve(__dirname);
        // this.fileUrl = path.split('node_modules')[0] + '/assets/settings.ini';
        console.log(this.electronService.path.join(process.resourcesPath))

    }

    saveVisualizerOptions(options: any): void {
        const readData = ini.parse(this.fs.readFileSync(this.fileUrl), 'utf-8');
        const generalSection = readData.general;

        const filteredOptions = options;
        delete filteredOptions.volume;
        delete filteredOptions.onCanvasDraw;
        delete filteredOptions.start;

        this.saveSections(filteredOptions, generalSection);
    }

    readVisualizerOptions(): any {
        const config = ini.parse(this.fs.readFileSync(this.fileUrl, 'utf-8'));
        if (config.visualizer !== null || config.visualizer) {
            return config.visualizer;
        }

        return {
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
            overlay: false,
            radial: false,
            reflexAlpha: 0.15,
            reflexBright: 1,
            reflexFit: true,
            reflexRatio: 0.5,
            showBgColor: true,
            showFPS: false,
            showLeds: false,
            showPeaks: true,
            showScaleX: false,
            showScaleY: false,
            smoothing: 0.7,
            spinSpeed: 0,
        }
    }

    readGeneralSettings(): object {
        const config = ini.parse(this.fs.readFileSync(this.fileUrl, 'utf-8'));
        if (config.general !== null || config.general) {
            return config.general;
        }
        return {
            com: 'COM3',
            colors: ['#FF0', '#FFF', '#00FF00'],
            leds: 30
        }
    }

    private saveSections(visualizerSection, generalSection) {
        this.fs.writeFileSync(this.fileUrl, ini.stringify(visualizerSection, {section: 'visualizer'}) + `${ini.stringify(generalSection, {section: 'general'})}`)
    }

    saveColors(colors: []) {
        const readData = ini.parse(this.fs.readFileSync(this.fileUrl, 'utf-8'));
        const visualizerSection = readData.visualizer;
        const comPort = readData.general.com;
        const amountOfLeds = readData.general.leds;

        const formattedColors = [];
        colors.forEach((color: any) => {
            formattedColors.push(color.hexString)
        })
        const toWrite = {
            com: comPort,
            colors: formattedColors,
            leds: amountOfLeds,
        }

        this.saveSections(visualizerSection, toWrite);
    }

    saveGeneralSettings(selectedCom: string, numLeds: number) {
        const readData = ini.parse(this.fs.readFileSync(this.fileUrl, 'utf-8'));
        const visualizerSection = readData.visualizer;

        const toWrite = {
            com: selectedCom,
            colors: readData.general.colors,
            leds: numLeds,
        };
        this.saveSections(visualizerSection, toWrite)
    }
}

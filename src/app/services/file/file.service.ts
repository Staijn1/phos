import {Injectable} from '@angular/core';
import {ElectronService} from '../electron/electron.service';

const ini = require('ini');

@Injectable({
    providedIn: 'root'
})
export class FileService {
    fs: any;

    constructor(private electronService: ElectronService) {
        this.fs = electronService.fs;
    }

    saveVisualizerOptions(options: any): void {
        // todo redo entirely
        const readData = ini.parse(this.fs.readFileSync('src/assets/settings.ini', 'utf-8'));
        const partToSave = readData.general;

        const filteredOptions = options;
        delete filteredOptions.volume;
        delete filteredOptions.onCanvasDraw;
        delete filteredOptions.start;

        this.fs.writeFileSync('src/assets/settings.ini', ini.stringify(filteredOptions, {section: 'visualizer'}) + `${ini.stringify(partToSave, {section: 'general'})}`)
    }

    readVisualizerOptions(): any {
        const config = ini.parse(this.fs.readFileSync('src/assets/settings.ini', 'utf-8'));
        return config.visualizer;
    }

    saveCom(selectedCom: string) {
        // const readData = ini.parse(this.fs.readFileSync('src/assets/settings.ini', 'utf-8'));
        // const partToSave = readData.visualizer;
        //
        // const filteredOptions =null;
        // this.fs.writeFileSync('src/assets/settings.ini', ini.stringify(filteredOptions, {section: 'visualizer'}) + `${ini.stringify(partToSave, {section: 'general'})}`)
        // console.log(partToSave)
    }
}

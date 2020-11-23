import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {AppSettings} from './appsettings';

@Injectable()
export class AppSettingsService {
    getSettings(): Observable<AppSettings> {
        const settings = new AppSettings();
        return Observable.of<AppSettings>(settings);
    }
}


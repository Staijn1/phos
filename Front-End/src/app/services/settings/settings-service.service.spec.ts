import {TestBed} from '@angular/core/testing';

import {SettingsService} from './settings.service';
import {ElectronService} from '../electron/electron.service';

describe('SettingsService', () => {
    let sut: SettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ElectronService]
        });
        sut = TestBed.inject(SettingsService);
    });

    it('should be created', () => {
        expect(sut).toBeTruthy();
    });


});

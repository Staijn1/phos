import {SettingsComponent} from './settings.component';
import {SettingsService} from '../../services/settings/settings.service';

describe('SettingsComponent', () => {
    let sut: SettingsComponent;

    beforeEach(() => {
        const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['readGeneralSettings', 'saveGeneralSettings']);
        const serialServiceMock = jasmine.createSpyObj('SerialConnectionService', ['scan']);

        sut = new SettingsComponent(settingsServiceMock, serialServiceMock);
    });

    it('should create', () => {
        expect(sut).toBeTruthy();
    });
});

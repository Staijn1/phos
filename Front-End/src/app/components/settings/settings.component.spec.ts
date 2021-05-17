import {SettingsComponent} from './settings.component';

describe('SettingsComponent', () => {
    let sut: SettingsComponent;

    beforeEach(() => {
        const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['readGeneralSettings', 'saveGeneralSettings']);

        sut = new SettingsComponent(settingsServiceMock);
    });

    it('should create', () => {
        expect(sut).toBeTruthy();
    });
});

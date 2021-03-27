import {SerialConnectionService} from './serial-connection.service';

describe('SerialConnectionService', () => {
    let sut: SerialConnectionService;
    beforeEach(() => {
        const electronServiceMock = jasmine.createSpyObj('ElectronService', ['isElectron']);
        const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['readGeneralSettings', 'saveGeneralSettings']);
        const chromaMock = jasmine.createSpyObj('ChromaEffectService', ['setColors']);

        sut = new SerialConnectionService(electronServiceMock, settingsServiceMock, chromaMock);
    });

    it('should be created', () => {
        expect(sut).toBeTruthy();
    });
});

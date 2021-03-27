import {ChromaSDKService} from './chromaSDK.service';

describe('ChromaSDKService', () => {
    let sut: ChromaSDKService;

    beforeEach(() => {
        const settingsServiceMock = jasmine.createSpyObj('SettingsService', ['readGeneralSettings', 'saveGeneralSettings']);
        sut = new ChromaSDKService(settingsServiceMock);
    });

    /*
    it('should be created', () => {
        expect(sut).toBeTruthy();
    });
    */
});

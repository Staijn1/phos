import {ColorService} from './color.service';

describe('ColorService', () => {
    let sut: ColorService;
    beforeEach(() => {
        const documentMock = jasmine.createSpyObj('HTMLDocument', ['addEventListener']);
        const connectionmock = jasmine.createSpyObj('ConnectionService', ['decreaseBrightness']);
        const colorServiceMock = jasmine.createSpyObj('ColorService', ['readGeneralSettings']);
        const chromaEffectMock = jasmine.createSpyObj('ChromaEffectService', ['setColors']);
        sut = new ColorService(documentMock, connectionmock, colorServiceMock, chromaEffectMock);
    });

    /*
    it('should create', () => {
        expect(sut).toBeTruthy();
    });
    */
});

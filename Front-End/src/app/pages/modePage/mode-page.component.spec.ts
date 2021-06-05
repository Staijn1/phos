import {ModePageComponent} from './mode-page.component';

describe('ModeComponent', () => {
    let sut: ModePageComponent;
    beforeEach(() => {
        const connectionMock = jasmine.createSpyObj('ConnectionService', ['setMode']);
        const chromaMock = jasmine.createSpyObj('ChromaEffectService', ['setColors']);

        sut = new ModePageComponent(connectionMock, chromaMock);
    });

    it('should create the component', () => {
        expect(sut).toBeTruthy();
    });
});

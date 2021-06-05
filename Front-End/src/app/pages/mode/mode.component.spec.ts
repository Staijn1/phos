import {ModeComponent} from './mode.component';

describe('ModeComponent', () => {
    let sut: ModeComponent;
    beforeEach(() => {
        const connectionMock = jasmine.createSpyObj('ConnectionService', ['setMode']);
        const chromaMock = jasmine.createSpyObj('ChromaEffectService', ['setColors']);

        sut = new ModeComponent(connectionMock, chromaMock);
    });

    it('should create the component', () => {
        expect(sut).toBeTruthy();
    });
});

import {ElectronService} from './electron.service';


describe('ElectronService', () => {
    let sut: ElectronService;

    beforeEach(() => {
        sut = new ElectronService();
    });

    it('should be created', () => {
        expect(sut).toBeTruthy();
    });
});

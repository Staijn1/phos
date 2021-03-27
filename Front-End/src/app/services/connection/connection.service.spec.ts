import {ConnectionService} from './connection.service';

describe('ConnectionService', () => {
    let sut;
    let serialConnectionServiceMock;
    let websocketServiceMock;


    beforeEach(() => {
        serialConnectionServiceMock = jasmine.createSpyObj('SerialConnectionService', ['setMode']);
        websocketServiceMock = jasmine.createSpyObj('WebsocketService', ['setMode']);
        sut = new ConnectionService(serialConnectionServiceMock, websocketServiceMock);
    });

    it('should create', () => {
        expect(sut).toBeTruthy();
    });
});

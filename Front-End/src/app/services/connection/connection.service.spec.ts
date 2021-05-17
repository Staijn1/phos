import {ConnectionService} from './connection.service';

describe('ConnectionService', () => {
  let sut;
  let websocketServiceMock;


  beforeEach(() => {
    websocketServiceMock = jasmine.createSpyObj('WebsocketService', ['setMode']);
    sut = new ConnectionService(websocketServiceMock);
  });

  it('should create', () => {
    expect(sut).toBeTruthy();
  });
});

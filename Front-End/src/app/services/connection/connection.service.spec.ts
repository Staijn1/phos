import {ConnectionService} from './connection.service';

describe('ConnectionService', () => {
  let sut;
  let websocketServiceMock;
  let apiServiceMock;

  beforeEach(() => {
    websocketServiceMock = jasmine.createSpyObj('WebsocketService', ['setMode']);
    apiServiceMock = jasmine.createSpyObj('APIService', ['setMode']);
    sut = new ConnectionService(websocketServiceMock, apiServiceMock);
  });

  it('should create', () => {
    expect(sut).toBeTruthy();
  });
});

import { RoomService } from '../room/room.service';
import { DeviceService } from '../device/device.service';
import { WebsocketService } from './websocket.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'socket.io';
import { ColorRGBA } from '../interfaces/ColorRGBA';
import { WebsocketMessage } from '@angulon/interfaces';
import { Device } from '../device/Device.model';

describe('WebsocketService', () => {
  let service: WebsocketService;
  let deviceService: DeviceService;
  let roomService: RoomService;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketService,
        {
          provide: DeviceService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: RoomService,
          useValue: {
            findAll: jest.fn(),
            getRoomsState: jest.fn(),
            updateRoomStateForRoomsSubject: { next: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<WebsocketService>(WebsocketService);
    deviceService = module.get<DeviceService>(DeviceService);
    roomService = module.get<RoomService>(RoomService);
    server = new Server();
    service['server'] = server;
  });

  describe('individualLedControl', () => {
    it('should map smaller incoming payload size to the correct payload size for each led in the strip', async () => {
      const rooms = ['room1'];
      const payload: ColorRGBA[] = [
        { R: 255, G: 255, B: 255, A: 1 },
        { R: 0, G: 0, B: 0, A: 1 },
      ];

      const devices: Device[] = [
        { name: 'device1', ledCount: 30, socketSessionId: 'session1' },
        { name: 'device2', ledCount: 60, socketSessionId: 'session2' },
      ] as Device[];

      service['devicesInRoomCache'].set('room1', devices);

      const sendEventToAllLedstripsInRoomSpy = jest.spyOn(service as any, 'sendEventToDevice');

      await service.individualLedControl(rooms, payload);

      expect(sendEventToAllLedstripsInRoomSpy).toHaveBeenCalledWith(
        devices[0],
        WebsocketMessage.LedstripIndividualControl,
        expect.any(Array)
      );

      expect(sendEventToAllLedstripsInRoomSpy).toHaveBeenCalledWith(
        devices[1],
        WebsocketMessage.LedstripIndividualControl,
        expect.any(Array)
      );


      // Check the first call has the desired payload sent to the device
      const mappedPayload1 = sendEventToAllLedstripsInRoomSpy.mock.calls[0][2] as string[];
      expect(mappedPayload1.length).toBe(30);
      // Expect the first 15 elements to be #ffffff
      expect(mappedPayload1.slice(0, 15)).toEqual(Array(15).fill('#ffffff'));
      // Expect the last 15 elements to be #000000
      expect(mappedPayload1.slice(15, 30)).toEqual(Array(15).fill('#000000'));


      const mappedPayload2 = sendEventToAllLedstripsInRoomSpy.mock.calls[1][2] as string[];
      expect(mappedPayload2.length).toBe(60);
      // Expect the first 30 elements to be #ffffff
      expect(mappedPayload2.slice(0, 30)).toEqual(Array(30).fill('#ffffff'));
      // Expect the last 30 elements to be #000000
      expect(mappedPayload2.slice(30, 60)).toEqual(Array(30).fill('#000000'));
    });

    it('should map larger incoming payload size to the correct payload size for each led in the strip', async () => {
      const rooms = ['room1'];
      // Create a payload of 100 elements, 50% of which are white and 50% black
      const payload: ColorRGBA[] = Array(50).fill({ R: 255, G: 255, B: 255, A: 1 }).concat(Array(50).fill({ R: 0, G: 0, B: 0, A: 1 }));

      const devices: Device[] = [
        { name: 'device1', ledCount: 30, socketSessionId: 'session1' },
        { name: 'device2', ledCount: 60, socketSessionId: 'session2' },
      ] as Device[];

      service['devicesInRoomCache'].set('room1', devices);

      const sendEventToAllLedstripsInRoomSpy = jest.spyOn(service as any, 'sendEventToDevice');

      await service.individualLedControl(rooms, payload);

      expect(sendEventToAllLedstripsInRoomSpy).toHaveBeenCalledWith(
        devices[0],
        WebsocketMessage.LedstripIndividualControl,
        expect.any(Array)
      );

      expect(sendEventToAllLedstripsInRoomSpy).toHaveBeenCalledWith(
        devices[1],
        WebsocketMessage.LedstripIndividualControl,
        expect.any(Array)
      );

      // Check the first call has the desired payload sent to the device
      const mappedPayload1 = sendEventToAllLedstripsInRoomSpy.mock.calls[0][2] as string[];
      expect(mappedPayload1.length).toBe(30);
      // Expect the first 15 elements to be #ffffff
      expect(mappedPayload1.slice(0, 15)).toEqual(Array(15).fill('#ffffff'));
      // Expect the last 15 elements to be #000000
      expect(mappedPayload1.slice(15, 30)).toEqual(Array(15).fill('#000000'));

      const mappedPayload2 = sendEventToAllLedstripsInRoomSpy.mock.calls[1][2] as string[];
      expect(mappedPayload2.length).toBe(60);
      // Expect the first 30 elements to be #ffffff
      expect(mappedPayload2.slice(0, 30)).toEqual(Array(30).fill('#ffffff'));
      // Expect the last 30 elements to be #000000
      expect(mappedPayload2.slice(30, 60)).toEqual(Array(30).fill('#000000'));
    });
  })
});

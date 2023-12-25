import {Injectable, Logger} from '@nestjs/common';
import {DAOService} from '../interfaces/DAOService';
import {Room} from './Room.model';
import {FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {validate} from 'class-validator';
import {DeviceService} from "../device/device.service";
import { ObjectId } from 'mongodb';
import { IRoom } from '@angulon/interfaces';


@Injectable()
export class RoomService implements DAOService<Room> {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    private readonly deviceService: DeviceService) {
  }

  async findAll(criteria?: FindManyOptions<Room>): Promise<Room[]> {
    return this.roomRepository.find(criteria);
  }

  async findOne(criteria: FindOneOptions<Room>): Promise<Room> {
    return this.roomRepository.findOne(criteria);
  }

  async create(roomData: Partial<Room>): Promise<Room> {
    await this.validate(roomData);
    const roomDefaults: IRoom = { connectedDevices: [], id: undefined, name: '' };
    const room = this.roomRepository.create({ ...roomDefaults, ...roomData });
    return this.roomRepository.save(room);
  }

  async update(criteria: FindOptionsWhere<Room>, RoomData: Partial<Room>): Promise<Room> {
    const existingRoom = await this.roomRepository.findOne({where: criteria});
    if (!existingRoom) return null;


    const updatedRoom = this.roomRepository.merge(existingRoom, RoomData);
    await this.validate(updatedRoom);
    return this.roomRepository.save(updatedRoom);
  }

  async remove(criteria: FindManyOptions<Room>): Promise<void> {
    const toRemove = await this.findAll(criteria);
    await this.roomRepository.remove(toRemove);
  }

  async validate(entityData: Partial<Room>): Promise<void> {
    const errors = await validate(entityData);
    if (errors.length > 0) {
      throw new Error(`Validation failed! ${errors.map(error => error.toString())}`);
    }
  }

  async createOrUpdate(criteria: FindOneOptions<Room>, entity: Partial<Room>): Promise<Room> {
    const existingRoom = await this.findOne(criteria);
    if (existingRoom) {
      await this.update(criteria.where as FindOptionsWhere<Room>, entity);
      return existingRoom;
    }

    return this.create(entity);
  }

  async assignDeviceToRoom(deviceId: string, roomId: string): Promise<Room> {
    const deviceObjectId = new ObjectId(deviceId);
    const roomObjectId = new ObjectId(roomId);
    // Find the device and the room in the database
    const device = await this.deviceService.findOne({where: {id: deviceObjectId}});
    const room = await this.findOne({where: {id: roomObjectId}});

    if (!device) throw new Error("Device not found");
    if(!room) throw new Error("Room not found");

    // Add the device to the room's connectedDevices array
    room.connectedDevices.push(device);

    // Save the updated room
    return this.roomRepository.save(room);
  }
}

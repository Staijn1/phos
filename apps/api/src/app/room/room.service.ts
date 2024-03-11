import {Injectable, Logger} from '@nestjs/common';
import {DAOService} from '../interfaces/DAOService';
import {Room} from './Room.model';
import {FindManyOptions, FindOneOptions, FindOptionsWhere, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {validate} from 'class-validator';
import {DeviceService} from '../device/device.service';
import {IRoom} from '@angulon/interfaces';


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
    const roomDefaults: IRoom = {connectedDevices: [], id: undefined, name: ''};
    const room = this.roomRepository.create({...roomDefaults, ...roomData});
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

  /**
   * Assigns a device to a room. If the device is already assigned to a room, it will be moved to the new room, so it's not assigned to multiple rooms at the same time.
   * @param deviceName
   * @param roomName
   * @throws Error Room with name ${roomName} not found
   * @throws Error Device with name ${deviceName} not found
   * @returns The updated room
   */
  async moveDeviceToRoom(deviceName: string, roomName: string): Promise<Room> {
    const device = await this.deviceService.findOne({where: {name: deviceName}});
    if (!device) {
      throw new Error(`Device with name ${deviceName} not found`);
    }

    const allRooms = await this.findAll();
    const room = await this.findOne({where: {name: roomName}});
    if (!room) {
      throw new Error(`Room with name ${roomName} not found`);
    }

    // If the device is already assigned to any other room, remove it from that room
    if (allRooms.some(r => r.connectedDevices.some(d => d.id === device.id))) {
      const oldRoom = allRooms.find(r => r.connectedDevices.some(d => d.id === device.id));
      oldRoom.connectedDevices = oldRoom.connectedDevices.filter(d => d.id !== device.id);
      await this.roomRepository.save(oldRoom);
    }

    // Add the device to the new room connectedDevices
    room.connectedDevices.push(device);
    return await this.roomRepository.save(room);
  }
}

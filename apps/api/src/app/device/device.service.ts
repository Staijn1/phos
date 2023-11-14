import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Device} from './Device.model';
import {DeleteResult, FindManyOptions, Repository, UpdateResult} from 'typeorm';
import {DAOService} from '../interfaces/DAOService';
import {validate} from "class-validator";
import {Room} from "../room/Room.model";

@Injectable()
export class DeviceService implements DAOService<Device> {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {
  }

  async findAll(criteria?: FindManyOptions<Device>): Promise<Device[]> {
    return this.deviceRepository.find(criteria);
  }

  async findOne(deviceName: string): Promise<Device> {
    return this.deviceRepository.findOne({where: {name: deviceName}});
  }

  async create(deviceData: Partial<Device>): Promise<Device> {
    await this.validate(deviceData);
    const device = this.deviceRepository.create(deviceData);
    return this.deviceRepository.save(device);
  }

  async update(deviceName: string, deviceData: Partial<Device>): Promise<UpdateResult> {
    await this.validate(deviceData);
    return this.deviceRepository.update({name: deviceName}, deviceData);
  }

  async remove(deviceName: string): Promise<DeleteResult> {
    return this.deviceRepository.delete({name: deviceName});
  }

  async validate(entityData: Partial<Room>): Promise<void> {
    const errors = await validate(entityData);
    if (errors.length > 0) {
      throw new Error(`Validation failed! ${errors.map(error => error.toString())}`);
    }
  }

  /**
   * Add a device if it does not exist yet
   * @param deviceName
   * @param entity
   * @returns True if the device was added, false if it already existed
   */
  async addIfNotExists(deviceName: string, entity: Partial<Device>): Promise<boolean> {
    const existingDevice = await this.findOne(deviceName);
    if (existingDevice) return false;

    const deviceInfo = {
      ...entity,
      name: deviceName
    }
    await this.create(deviceInfo);
    return true;
  }
}


import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Device} from './Device.model';
import {DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult} from 'typeorm';
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

  async findOne(criteria: FindOneOptions<Device>): Promise<Device> {
    return this.deviceRepository.findOne(criteria);
  }

  async create(deviceData: Partial<Device>): Promise<Device> {
    await this.validate(deviceData);
    const device = this.deviceRepository.create(deviceData);
    return this.deviceRepository.save(device);
  }

  async update(criteria: FindOptionsWhere<Device>, deviceData: Partial<Device>): Promise<UpdateResult> {
    const existingDevice = await this.deviceRepository.findOne({where: criteria});
    if (existingDevice) {
      const updatedDevice = this.deviceRepository.merge(existingDevice, deviceData);
      await this.validate(updatedDevice);
      return await this.deviceRepository.save(updatedDevice) as unknown as UpdateResult;
    } else {
      throw new Error('Device not found');
    }
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

  async createOrUpdate(criteria: FindOneOptions<Device>, entity: Partial<Device>): Promise<Device> {
    const existingDevice = await this.findOne(criteria);
    if (existingDevice) {
      await this.update(criteria.where as FindOptionsWhere<Device>, entity);
      return existingDevice;
    }

    return this.create(entity);
  }
}


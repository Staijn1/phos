import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Device} from './Device.model';
import {FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository} from 'typeorm';
import {DAOService} from '../interfaces/DAOService';
import {validate} from 'class-validator';

@Injectable()
export class DeviceService implements DAOService<Device> {
  private logger = new Logger(DeviceService.name);

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

  async update(criteria: FindOptionsWhere<Device>, deviceData: Partial<Device>): Promise<Device> {
    const existingDevice = await this.deviceRepository.findOne({where: criteria});
    if (!existingDevice) return null;


    const updatedDevice = this.deviceRepository.merge(existingDevice, deviceData);
    await this.validate(updatedDevice);
    return this.deviceRepository.save(updatedDevice);
  }

  async remove(criteria: FindManyOptions<Device>): Promise<void> {
    const toRemove = await this.findAll(criteria);
    await this.deviceRepository.remove(toRemove);
  }

  async validate(entityData: Partial<Device>): Promise<void> {
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

  /**
   * Rename a device in the database, based on the session id of the device requesting the rename
   * @param sessionId
   * @param payload
   */
  async renameDevice(sessionId: string, payload: string) {
    this.logger.log(`Renaming device with session id ${sessionId} to ${payload}`)
    await this.update({socketSessionId: sessionId}, {name: payload});
  }
}


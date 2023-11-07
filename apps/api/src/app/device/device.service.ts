import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Device} from './Device.model';
import {Repository} from 'typeorm';
import {LedstripState} from '@angulon/interfaces';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  async findOne(ipAddress: string): Promise<Device> {
    return this.deviceRepository.findOne({where: {ipAddress: ipAddress}});
  }

  async create(deviceData: Partial<Device>): Promise<Device> {
    const device = this.deviceRepository.create(deviceData);
    return this.deviceRepository.save(device);
  }

  async update(ipAddress: string, deviceData: Partial<Device>): Promise<Device> {
    await this.deviceRepository.update(ipAddress, deviceData);
    return this.deviceRepository.findOne({where: {ipAddress: ipAddress}});
  }

  async remove(id: number): Promise<void> {
    await this.deviceRepository.delete(id);
  }

  /**
   * Add a device if it does not exist yet
   * @param remoteAddress
   * @param deviceState
   * @returns True if the device was added, false if it already existed
   */
  async addIfNotExists(remoteAddress: string, deviceState: LedstripState): Promise<boolean> {
    const device = await this.findOne(remoteAddress);
    if (device) return false;

    await this.create({ipAddress: remoteAddress, name: 'Unknown Device', state: deviceState});
    return true;
  }
}


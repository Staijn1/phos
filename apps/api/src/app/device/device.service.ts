import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Device} from '../../entities/Device';
import {Repository} from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

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
}


import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './Device.model';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { DAOService } from '../interfaces/DAOService';
import { validate } from 'class-validator';
import { hexToRgb } from '../utils/ColorUtils';

@Injectable()
export class DeviceService implements DAOService<Device> {
  private logger = new Logger(DeviceService.name);

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>
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
    const existingDevice = await this.deviceRepository.findOne({ where: criteria });
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
    this.logger.log(`Renaming device with session id ${sessionId} to ${payload}`);
    await this.update({ socketSessionId: sessionId }, { name: payload });
  }

  async estimatePowerDrawForAllOnlineLedstrips(): Promise<Map<string, number>> {
    // The maximum current per color channel in milliamps
    const maxCurrentPerColor = 20;

    // The voltage supply to the LED strip in volts
    const voltage = 5;
    const ledstrips = await this.findAll({ where: { isConnected: true, isLedstrip: true }, relations: ['room'] });

    const powerDrawMap = new Map<string, number>();

    for (const device of ledstrips) {
      // Extract the brightness and colors from the device state
      const { brightness, colors } = device.room.state;
      const numLeds = device.ledCount;

      // Calculate the current draw for each color channel and sum them up
      const totalCurrentPerLed = colors.map(color => {
        const rgb = hexToRgb(color);

        // Calculate the current draw for each color channel based on its intensity (0-255), and then sum them up to get the total current draw per LED
        return rgb.map(c => c / 255 * maxCurrentPerColor).reduce((a, b) => a + b, 0);
      }).reduce((a, b) => a + b, 0);

      // Calculate the power draw for this device
      const powerDraw = numLeds * totalCurrentPerLed * voltage * (brightness / 255) / 1000; // in Watts

      powerDrawMap[device.name]= powerDraw;
    }

    return powerDrawMap;
  }
}


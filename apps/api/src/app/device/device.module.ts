import { Module } from '@nestjs/common';
import {DeviceService} from './device.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Device} from './Device.model';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule {
}

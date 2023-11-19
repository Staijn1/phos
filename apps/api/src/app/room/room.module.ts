import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Room} from './Room.model';
import {RoomService} from './room.service';
import {DeviceModule} from "../device/device.module";

@Module({
  imports: [TypeOrmModule.forFeature([Room]), DeviceModule],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule {
}

import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Room} from './Room.model';
import {RoomService} from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  providers: [RoomService],
  exports: [RoomService]
})
export class RoomModule {
}

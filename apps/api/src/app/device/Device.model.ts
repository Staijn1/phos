import {IDevice, LedstripState} from '@angulon/interfaces';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';
import {Room} from '../room/Room.model';
import {Logger} from '@nestjs/common';

@Entity()
export class Device implements IDevice{
  private logger: Logger = new Logger(Device.name);
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  socketSessionId: string;

  @Column()
  name: string;

  @Column('jsonb', { default: () => "'{}'" })
  state: LedstripState;

  @Column({ default: true })
  isLedstrip: boolean

  @Column()
  isConnected: boolean;

  @ManyToOne(() => Room, (room) => room.connectedDevices)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @AfterInsert()
  onDeviceChange() {
   this.logger.debug(`Device ${this.id} inserted`);
  }
  @AfterUpdate()
  onDeviceUpdate(){
    this.logger.debug(`Device ${this.id} updated`);
  }

  @AfterRemove()
  onDeviceRemove(){
    this.logger.debug(`Device ${this.id} removed`);
  }
}

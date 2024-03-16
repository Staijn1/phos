import {IDevice} from '@angulon/interfaces';
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Room} from '../room/Room.model';

@Entity()
export class Device implements IDevice{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  socketSessionId: string;

  @Column()
  name: string;

  @Column({ default: true })
  isLedstrip: boolean

  @Column()
  isConnected: boolean;

  @ManyToOne(() => Room, (room) => room.connectedDevices, {onDelete: 'SET NULL'})
  room: Room;
}

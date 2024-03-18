import { IRoom, RoomState } from '@angulon/interfaces';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {Device} from '../device/Device.model';
import {MinLength} from 'class-validator';

@Entity()
export class Room implements IRoom{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @MinLength(0)
  @Unique("UniqueRoomName", ["name"])
  name: string;

  @OneToMany(() => Device, (device) => device.room, {eager: true})
  connectedDevices: Device[];

  @Column('simple-json', { default: () => "'{}'" })
  state: RoomState;
}

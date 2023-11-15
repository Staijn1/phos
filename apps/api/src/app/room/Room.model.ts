import {IRoom} from '@angulon/interfaces';
import {Column, Entity, JoinColumn, ObjectId, ObjectIdColumn, OneToMany} from 'typeorm';
import {Device} from '../device/Device.model';
import {MinLength} from "class-validator";

@Entity()
export class Room implements IRoom{
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  @MinLength(0)
  name: string;

  @OneToMany(() => Device, (device) => device.room)
  @JoinColumn()
  connectedDevices: Device[];
}

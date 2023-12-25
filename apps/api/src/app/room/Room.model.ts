import {IRoom} from '@angulon/interfaces';
import {Column, Entity, JoinColumn, ObjectIdColumn, OneToMany, PrimaryColumn, Unique} from 'typeorm';
import {Device} from '../device/Device.model';
import {MinLength} from "class-validator";
import {ObjectId} from "mongodb";

@Entity()
export class Room implements IRoom{
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  @MinLength(0)
  @Unique("UniqueRoomName", ["name"])
  name: string;

  @OneToMany(() => Device, (device) => device.room)
  @JoinColumn()
  @Column({ type: 'array', default: [] })
  connectedDevices: Device[];
}

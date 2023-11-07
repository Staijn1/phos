import {IDevice, LedstripState} from '@angulon/interfaces';
import {Column, Entity, ObjectId, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Device implements IDevice{
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  ipAddress: string;

  @Column()
  name: string;

  @Column('jsonb', { default: () => "'{}'" })
  state: LedstripState;
}

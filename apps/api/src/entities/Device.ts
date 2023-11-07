import {IDevice, LedstripState} from '@angulon/interfaces';
import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class Device implements IDevice{
  @PrimaryColumn()
  ipAddress: string;

  @Column()
  name: string;

  @Column('jsonb', { default: () => "'{}'" })
  state: LedstripState;
}

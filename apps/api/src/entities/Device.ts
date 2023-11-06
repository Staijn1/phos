import { IDevice, LedstripState } from '@angulon/interfaces';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Device implements IDevice{
  @PrimaryColumn()
  ipAdress: string;
  name: string;
  state: LedstripState;
}

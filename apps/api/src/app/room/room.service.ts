import {Injectable, Logger} from '@nestjs/common';
import {DAOService} from '../interfaces/DAOService';
import {Room} from './Room.model';
import {FindManyOptions, FindOneOptions, FindOptionsWhere, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {validate} from 'class-validator';


@Injectable()
export class RoomService implements DAOService<Room> {
  private readonly logger = new Logger(RoomService.name);

  constructor(@InjectRepository(Room)
              private readonly roomRepository: Repository<Room>) {
  }

  async findAll(criteria?: FindManyOptions<Room>): Promise<Room[]> {
    return this.roomRepository.find(criteria);
  }

  async findOne(criteria: FindOneOptions<Room>): Promise<Room> {
    return this.roomRepository.findOne(criteria);
  }

  async create(RoomData: Partial<Room>): Promise<Room> {
    await this.validate(RoomData);
    const Room = this.roomRepository.create(RoomData);
    return this.roomRepository.save(Room);
  }

  async update(criteria: FindOptionsWhere<Room>, RoomData: Partial<Room>): Promise<Room> {
    const existingRoom = await this.roomRepository.findOne({where: criteria});
    if (!existingRoom) return null;


    const updatedRoom = this.roomRepository.merge(existingRoom, RoomData);
    await this.validate(updatedRoom);
    return this.roomRepository.save(updatedRoom);
  }

  async remove(criteria: FindManyOptions<Room>): Promise<void> {
    const toRemove = await this.findAll(criteria);
    await this.roomRepository.remove(toRemove);
  }

  async validate(entityData: Partial<Room>): Promise<void> {
    const errors = await validate(entityData);
    if (errors.length > 0) {
      throw new Error(`Validation failed! ${errors.map(error => error.toString())}`);
    }
  }

  async createOrUpdate(criteria: FindOneOptions<Room>, entity: Partial<Room>): Promise<Room> {
    const existingRoom = await this.findOne(criteria);
    if (existingRoom) {
      await this.update(criteria.where as FindOptionsWhere<Room>, entity);
      return existingRoom;
    }

    return this.create(entity);
  }
}

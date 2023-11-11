import {Injectable, Logger} from '@nestjs/common';
import {DAOService} from '../interfaces/DAOService';
import {Room} from './Room.model';
import {DeleteResult, ObjectId, Repository, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ObjectId as MongoObjectId} from 'mongodb';
import {validate} from "class-validator";


@Injectable()
export class RoomService implements DAOService<Room> {
  private readonly logger = new Logger(RoomService.name);

  constructor(@InjectRepository(Room)
              private readonly roomRepository: Repository<Room>) {
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find({relations: ['connectedDevices']});
  }

  async findOne(id: string): Promise<Room> {
    return this.roomRepository.findOne({where: {id: new MongoObjectId(id)}, relations: ['connectedDevices']});
  }

  async create(roomData: Partial<Room>): Promise<Room> {
    await this.validate(roomData);
    const room = this.roomRepository.create(roomData);
    return this.roomRepository.save(room);
  }

  async update(id: string, roomData: Partial<Room>): Promise<UpdateResult> {
    await this.validate(roomData);
    return this.roomRepository.update(id, roomData);
  }

  async remove(id: ObjectId): Promise<DeleteResult> {
    const deleteResult = await this.roomRepository.delete(id);
    this.logger.log(`Room with id ${id} was deleted`);
    return deleteResult;
  }

  async validate(entityData: Partial<Room>): Promise<void> {
    const errors = await validate(entityData);
    if (errors.length > 0) {
      throw new Error(`Validation failed! ${errors.map(error => error.toString())}`);
    }
  }
}

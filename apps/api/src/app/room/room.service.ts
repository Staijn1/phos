import {Injectable} from '@nestjs/common';
import {DAOService} from '../interfaces/DAOService';
import {Room} from './Room.model';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ObjectId as MongoObjectId} from 'mongodb';


@Injectable()
export class RoomService implements DAOService<Room> {
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
    const room = this.roomRepository.create(roomData);
    return this.roomRepository.save(room);
  }

  async update(id: string, roomData: Partial<Room>): Promise<Room> {
    return this.roomRepository.save({id: new MongoObjectId(id), ...roomData});
  }

  async remove(id: string): Promise<void> {
    await this.roomRepository.delete(id);
  }
}

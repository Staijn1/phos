import {DeleteResult, ObjectId} from 'typeorm';

export interface DAOService<Entity> {
  findAll(): Promise<Entity[]>;
  findOne(id: string | number): Promise<Entity>;
  create(entityData: Partial<Entity>): Promise<Entity>;
  update(id: string | number, entityData: Partial<Entity>): Promise<Entity>;
  remove(id: string | number | ObjectId): Promise<DeleteResult>;
}

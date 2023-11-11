import {DeleteResult, ObjectId, UpdateResult} from 'typeorm';

export interface DAOService<Entity> {
  findAll(): Promise<Entity[]>;
  findOne(id: string | number): Promise<Entity>;
  create(entityData: Partial<Entity>): Promise<Entity>;
  update(id: string | number, entityData: Partial<Entity>): Promise<UpdateResult>;
  remove(id: string | number | ObjectId): Promise<DeleteResult>;
  validate(entityData: Partial<Entity>): Promise<void>;
}

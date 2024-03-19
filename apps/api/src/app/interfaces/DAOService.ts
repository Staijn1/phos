import {FindManyOptions, FindOneOptions, FindOptionsWhere} from 'typeorm';

export interface DAOService<Entity> {
  findAll(criteria?: FindManyOptions<Entity>): Promise<Entity[]>;
  findOne(criteria: FindOneOptions<Entity>): Promise<Entity>;
  create(entityData: Partial<Entity>): Promise<Entity>;
  updateOne(criteria: FindOptionsWhere<Entity>, entityData: Partial<Entity>): Promise<Entity>;
  remove(criteria: FindManyOptions<Entity>): Promise<void>;
  validate(entityData: Partial<Entity>): Promise<void>;
  createOrUpdate(criteria: FindOneOptions<Entity>, entity: Partial<Entity>): Promise<Entity>
}

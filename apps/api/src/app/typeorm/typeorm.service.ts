import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentConfiguration } from '../../environments/IEnvironmentConfiguration';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}


  /**
   * Builds the options to use for TypeORM
   */
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const db = this.config.get<IEnvironmentConfiguration['database']>('database');
    const productionMode = this.config.get<IEnvironmentConfiguration['production']>('production');
    return {
      type: 'mongodb',
      host: db.host,
      port: db.port,
      database: db.database,
      username: db.username,
      password: db.password,
      authSource: 'admin',
      //   migrations: ['dist/migrations/*.{ts,js}'],
      logger: 'file',
      synchronize: !productionMode, // do not set to TRUE in production mode - possible data loss
      autoLoadEntities: true,
    };
  }
}

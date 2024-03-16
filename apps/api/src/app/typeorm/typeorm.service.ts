import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {IDatabaseConfiguration, IEnvironmentConfiguration} from '../../environments/IEnvironmentConfiguration';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {join} from 'path';
import {DataSourceOptions} from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private static readonly logger = new Logger(TypeOrmConfigService.name);

  constructor(private config: ConfigService) {
  }


  /**
   * Builds the options to use for TypeORM
   */
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig = this.config.get<IEnvironmentConfiguration['database']>('database');

    return {
      ...TypeOrmConfigService.GetBaseDatasourceOptions(dbConfig),
      migrationsRun: true,
      synchronize: false, // Please create migrations to update the database schema (automatically applied on API startup, or see readme.md for CLI)
      autoLoadEntities: true,
    };
  }

  /**
   * Get the base datasource options used for the application but also in the orm.config.ts file to be able to use the same configuration for generating migrations
   */
  public static GetBaseDatasourceOptions(dbConfig: IDatabaseConfiguration): DataSourceOptions {

    const configSafeToLog = {...dbConfig, password: 'REDACTED'};
    this.logger.log(`Connecting to database user the following configuration: ${JSON.stringify(configSafeToLog, null, 2)}`);

    return {
      type: 'mariadb',
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      username: dbConfig.username,
      password: dbConfig.password,
      migrations: [join(__dirname, '../../../migrations/*.{ts,js}')],
      entities: [join(__dirname, '../../**/*.model.{ts,js}')],
      logger: 'advanced-console',
      logging: true
    }
  }
}

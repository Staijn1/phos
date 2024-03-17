import {DataSource} from 'typeorm';
import {TypeOrmConfigService} from './src/app/typeorm/typeorm.service';
import {constructEnvironmentConfiguration} from './src/environments/EnvironmentConfig';
import {config} from 'dotenv';


config();

/**
 * This configuration is used by the TypeORM CLI to generate migrations
 * To run the migrations, start the application. The migrations will be run automatically.
 * Uses the environment.ts file to get the database configuration (local dev config)
 */
export default new DataSource(TypeOrmConfigService.GetBaseDatasourceOptions(constructEnvironmentConfiguration().database));

import {IEnvironmentConfiguration} from './IEnvironmentConfiguration';

export const environment: Partial<IEnvironmentConfiguration> = {
  production: false,
  database: {
    host: 'localhost',
    port: 3306,
    database: 'phos',
    username: 'root',
    password: 'example',
  },
};

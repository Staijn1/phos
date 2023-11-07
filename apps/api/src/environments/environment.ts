import {IEnvironmentConfiguration} from './IEnvironmentConfiguration';

export const environment: Partial<IEnvironmentConfiguration> = {
  production: false,
  database: {
    host: 'localhost',
    port: 27017,
    database: 'phos',
    username: 'root',
    password: 'example',
  },
};

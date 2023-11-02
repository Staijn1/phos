import {IDatabaseConfiguration, IEnvironmentConfiguration} from './IEnvironmentConfiguration';
import {environment} from './environment';

/**
 * This method merges environment variables and the object coming from environment.ts.
 * This way we can override any values from environment.ts with environment variables and also safely store secrets.
 * Returns a new object, leaving the original objects untouched.
 */
export const constructEnvironmentConfiguration = (): IEnvironmentConfiguration => {
  const envVariables = process.env;
  const environmentConfigurationCopy = JSON.parse(JSON.stringify(environment)) as IEnvironmentConfiguration;
  if (!envVariables) return environmentConfigurationCopy;

  if (envVariables.PRODUCTION) environmentConfigurationCopy.production = envVariables.PRODUCTION === 'true';

  const databaseConfig: Partial<IDatabaseConfiguration> = {};
  if (envVariables.DATABASE_HOST) databaseConfig.host = envVariables.DATABASE_HOST;
  if (envVariables.DATABASE_PORT) databaseConfig.port = parseInt(envVariables.DATABASE_PORT, 10);
  if (envVariables.DATABASE_DATABASE) databaseConfig.database = envVariables.DATABASE_DATABASE;
  if (envVariables.DATABASE_USERNAME) databaseConfig.username = envVariables.DATABASE_USERNAME;
  if (envVariables.DATABASE_PASSWORD) databaseConfig.password = envVariables.DATABASE_PASSWORD;
  environmentConfigurationCopy.database = {...(environmentConfigurationCopy.database ?? {}), ...databaseConfig} as IDatabaseConfiguration;

  return environmentConfigurationCopy;
};

import { constructEnvironmentConfiguration } from "./EnvironmentConfig";
import { IDatabaseConfiguration, IEnvironmentConfiguration } from './IEnvironmentConfiguration';
import { IsBoolean, IsNumber, IsObject, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class DatabaseEnvironment implements IDatabaseConfiguration {
  @IsString()
  host: string;
  @IsNumber()
  port: number;
  @IsString()
  database: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
}

class EnvironmentConfiguration implements IEnvironmentConfiguration {
  @IsBoolean()
  production = false;

  @IsObject()
  database: DatabaseEnvironment;
}



/**
 * Validation function for the environment config which is possibly set by the environment.ts files or environment variables.
 * @throws Error if the validation fails.
 * @returns the validated environment configuration.
 */
export function validateEnvironmentConfiguration() {
  const config = constructEnvironmentConfiguration();
  const validatedConfig = plainToInstance(EnvironmentConfiguration, config, {enableImplicitConversion: true});
  const errors = validateSync(validatedConfig, {skipMissingProperties: false});

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return {};
}


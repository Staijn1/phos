export interface IEnvironmentConfiguration {
  production: boolean;
  database: IDatabaseConfiguration;
}

export interface IDatabaseConfiguration {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}



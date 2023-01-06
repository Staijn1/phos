/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

import {AppModule} from './app/app.module';
import { Client } from "pg";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  const client = new Client({
    user: 'postgres',
    host: 'angulon_db',
    database: 'angulon',
    password: 'postgres',
    schema: 'public',
    port: 7002,
  })
  client.connect()
  client.query('SELECT * FROM pg_catalog.pg_tables', (err, res) => {
    console.log("Error", err)
    console.log("Res", res)
    client.end()
  })
}

bootstrap();

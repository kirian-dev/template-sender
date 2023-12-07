import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: process.env.APP_PORT || 3001,
    },
  });
  await app.listen();
  Logger.log("Auth service listening on port " + process.env.APP_PORT);
}
bootstrap();

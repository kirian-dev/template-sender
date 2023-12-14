import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.APP_URL || 'amqp://localhost:5672'],
      queue: 'new_sender_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.listen();
}
bootstrap();

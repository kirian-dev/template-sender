import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { File } from './entities/file.entity';
import { UploadFileRepository } from './upload-file.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([User, File]),
  ClientsModule.register([
    {
      name: 'MAIL_SENDER_SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'new_sender_queue',
        queueOptions: {
          durable: false
        },
      },
    },
  ]),],
  controllers: [UploadFileController],
  providers: [UploadFileService, UploadFileRepository, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },],
})
export class UploadFileModule { }

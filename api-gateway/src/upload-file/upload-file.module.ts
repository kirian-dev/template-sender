import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { File } from './entities/file.entity';
import { UploadFileRepository } from './upload-file.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([User, File])],
  controllers: [UploadFileController],
  providers: [UploadFileService, UploadFileRepository, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },],
})
export class UploadFileModule { }

import { Module } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';
import { MailSenderController } from './mail-sender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { File } from './entities/file.entity';
import { MailSenderRepository } from './mail-sender.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, File])
  ],
  controllers: [MailSenderController],
  providers: [MailSenderService, MailSenderRepository],
})
export class MailSenderModule { }

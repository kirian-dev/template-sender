import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MailSenderModule } from './mail-sender/mail-sender.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PRIMARY_DB_HOST,
      port: parseInt(process.env.PRIMARY_DB_PORT),
      username: process.env.PRIMARY_DB_USERNAME,
      password: process.env.PRIMARY_DB_PASSWORD,
      database: process.env.PRIMARY_DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MailSenderModule
  ],
})
export class AppModule { }

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

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
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

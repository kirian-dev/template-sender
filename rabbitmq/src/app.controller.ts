import { Controller, } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IAccount } from './common/interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @MessagePattern('send-account')
  getTest(@Payload() data: IAccount[]): string {
    console.log(data);
    return 'test';
  }
}

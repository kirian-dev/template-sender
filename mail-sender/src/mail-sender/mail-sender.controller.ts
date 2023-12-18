import { IMailSender } from 'src/common/interfaces';
import { Controller } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailSenderController {
  constructor(private readonly mailSenderService: MailSenderService) { }

  @MessagePattern("send-account")
  sendMailToAccount(@Payload() data: IMailSender) {
    console.log("test")
    return this.mailSenderService.sendMail(data);
  }
}
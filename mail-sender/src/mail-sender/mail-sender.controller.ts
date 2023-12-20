import { IMailSender } from 'src/common/interfaces';
import { Controller } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailSenderController {
  constructor(private readonly mailSenderService: MailSenderService) { }

  @MessagePattern("send-account")
  async sendMailToAccount(@Payload() data: IMailSender) {
    try {
      return await this.mailSenderService.sendMail(data);
    } catch (error) {
      return error
    }
  }
}
import { Injectable } from '@nestjs/common';
import { MailSenderRepository } from './mail-sender.repository';
import { IMailSender } from 'src/common/interfaces';

@Injectable()
export class MailSenderService {
  constructor(private mailSenderRepository: MailSenderRepository) { }

  async sendMail(data: IMailSender) {
   
    await this.mailSenderRepository.updateEmailStatus(data.fileId);
    return  console.log("send template successfully")
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { MailSenderRepository } from './mail-sender.repository';
import { IMailSender } from 'src/common/interfaces';
import { sendEmailTemplate } from './mail-sender.helper';

@Injectable()
export class MailSenderService {
  constructor(private mailSenderRepository: MailSenderRepository) { }

  async sendMail(data: IMailSender) {
    try {
      const sendEmailResult = await sendEmailTemplate(data);

      if (sendEmailResult) {
        await this.mailSenderRepository.updateSuccessEmailStatus(data.fileId);
      } else {
        this.mailSenderRepository.updateFailedEmailStatus(data.fileId)
      }
    } catch (err) {
      Logger.error("Error in sendMailService:", err)
      throw new Error(err)
    };
  }
}
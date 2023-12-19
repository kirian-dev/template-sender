import { Repository } from 'typeorm';
import { File } from "./entities/file.entity"
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailSenderRepository {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) { }

  async updateSuccessEmailStatus(fileId: number) {
    try {
      await this.fileRepository.increment({ id: fileId }, 'success_emails', 1);
      await this.fileRepository.decrement({ id: fileId }, 'pending_emails', 1);
    } catch (err) {
      await this.updateFailedEmailStatus(fileId);
      throw new Error(err)
    }
  }

  async updateFailedEmailStatus(fileId: number) {
    try {
      await this.fileRepository.increment({ id: fileId }, 'failed_emails', 1);
      await this.fileRepository.decrement({ id: fileId }, 'pending_emails', 1);
    } catch (err) {
      throw new Error(err)
    }
  }
}

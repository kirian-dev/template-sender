import { StatusFile } from './types';
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

  async updateEmailStatus(fileId: number) {
    await this.fileRepository.increment({ id: fileId }, 'success_emails', 1);
    await this.fileRepository.decrement({ id: fileId }, 'pending_emails', 1);
  }
}

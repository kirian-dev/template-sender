import { StatusFile } from './types';
import { CreateFileDto } from './dto/create-upload-file.dto';
import { Repository } from 'typeorm';
import { File } from "./entities/file.entity"
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadFileRepository {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>
  ) { }


  async create(dto: CreateFileDto, pendingEmails: number): Promise<File | undefined> {
    const { file, emailText, userId } = dto;
    try {
      const newFile = this.fileRepository.create({
        name: file.originalname,
        emailText,
        userId: userId,
        pending_emails: pendingEmails
      });
      return this.fileRepository.save(newFile);
    } catch (error) {

      throw new Error(error)
    }
  }


  async updateFailedEmailStatus(fileId: number) {
    await this.updateEmailStatus(fileId, 'failed');
  }

  async updateSuccessEmailStatus(fileId: number) {
    await this.updateEmailStatus(fileId, 'success');
  }

  async updateEmailStatus(fileId: number, newStatus: string) {
    if (newStatus === 'success') {
      await this.fileRepository.increment({ id: fileId }, 'success_emails', 1);
    } else if (newStatus === 'failed') {
      await this.fileRepository.increment({ id: fileId }, 'failed_emails', 1);
    }
    await this.fileRepository.decrement({ id: fileId }, 'pending_emails', 1);
  }

  async updateStatus(fileId: number, newStatus: StatusFile, isEndTime?: boolean) {
    try {
      const updateData: { status: StatusFile, endTime?: Date | null } = {
        status: newStatus,
      };

      if (isEndTime) {
        updateData.endTime = new Date(Math.floor(Date.now() / 1000) * 1000);
      }

      await this.fileRepository.update(fileId, updateData);
    } catch (err) {
      throw new Error(err)
    }
  }
  async getById(fileId: number, userId: number) {
    return this.fileRepository.findOneBy({ id: fileId, userId: userId });
  }
}

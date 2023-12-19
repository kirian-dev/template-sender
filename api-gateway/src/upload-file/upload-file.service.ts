import { StatusFile } from './types';
import { BadGatewayException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateFileDto } from './dto/create-upload-file.dto';
import { parseCSV, validateCsvFormat } from './helpers';
import { UploadFileRepository } from './upload-file.repository';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
@Injectable()
export class UploadFileService {
  constructor(
    private uploadFileRepository: UploadFileRepository,
    @Inject('MAIL_SENDER_SERVICE') private readonly messageQueue: ClientProxy
  ) { }

  async create(createUploadFileDto: CreateFileDto) {
    try {
      const csvData = await parseCSV(createUploadFileDto.file.buffer);

      const validateCsv = validateCsvFormat(csvData);

      if (validateCsv) {
        throw new Error(validateCsv);
      }
      const response = await this.uploadFileRepository.create(createUploadFileDto, csvData.length);

      for (let i = 0; i < csvData.length; i++) {
        const account = csvData[i];
        try {
          await this.processRecord(response.id, account, createUploadFileDto.emailText);
        } catch (error) {
          await this.uploadFileRepository.updateStatus(response.id, "failed", true);
          Logger.error(`Error processing record for account: ${JSON.stringify(account)}`);
          throw error;
        }
      }

      await this.uploadFileRepository.updateStatus(response.id, "completed", true);

      return response;
    } catch (error) {
      console.log("error account create", error)
      throw new Error(error);
    }
  }

  async processRecord(fileId: number, account: Record<string, string>, emailText: string) {
    const { first_name, last_name, email } = account;

    if (!first_name || !last_name || !email) {
      await this.uploadFileRepository.updateFailedEmailStatus(fileId);
      return;
    }
    const record = new RmqRecordBuilder({ ...account, fileId, emailText })
      .setOptions({
        priority: 1,
      })
      .build();
    this.messageQueue.send("send-account", record).subscribe({
      error: (error) => {
        this.uploadFileRepository.updateFailedEmailStatus(fileId);
        console.log("error processing record for account", error)
      }
    });
  }

  findAll() {
    try {
      return `This action returns all uploadFile`;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const file = await this.uploadFileRepository.getById(id, userId);
      if (!file) {
        throw new BadGatewayException(`File ${file.id} not found`);
      }
      return file;
    } catch (error) {
      throw new Error(error);
    }
  }
}

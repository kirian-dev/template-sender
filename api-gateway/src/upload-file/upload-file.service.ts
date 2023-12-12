import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-upload-file.dto';
import { parseCSV, validateCsvFormat } from './helpers';
import { UploadFileRepository } from './upload-file.repository';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { IAccount } from 'src/common/interfaces/file.interface';

@Injectable()
export class UploadFileService {
  constructor(
    private uploadFileRepository: UploadFileRepository,
    @Inject('RMQ_SERVICE') private readonly messageQueue: ClientProxy
  ) { }

  async create(createUploadFileDto: CreateFileDto) {
    try {
      const csvData = await parseCSV(createUploadFileDto.file.buffer);

      const validateCsv = validateCsvFormat(csvData);

      if (validateCsv) throw new Error(validateCsv);
      const rowHeader = 1;

      const pendingAccounts = csvData.length - rowHeader;

      const response = await this.uploadFileRepository.create(createUploadFileDto, pendingAccounts);

      const batchSize = 100;
      const batches = this.chunkArray(csvData.slice(1), batchSize);

      for (const batch of batches) {
        const record = new RmqRecordBuilder(batch)
          .setOptions({
            priority: 1,
          })
          .build();
        this.messageQueue.send("send-account", record).subscribe();
      }

      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async processRecord(fileId: number, record: Record<string, string>) {
    const { first_name, last_name, email } = record;

    if (!first_name || !last_name || !email) {
      await this.uploadFileRepository.updateFailedEmailStatus(fileId);
      return;
    }

    await this.uploadFileRepository.updateSuccessEmailStatus(fileId);
    console.log(`Email sent successfully to ${email}`);
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

  private chunkArray(array: IAccount[], size: number): IAccount[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}

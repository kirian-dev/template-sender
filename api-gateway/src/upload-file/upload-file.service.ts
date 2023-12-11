import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-upload-file.dto';
import { parseCSV, validateCsvFormat } from './helpers';
import { UploadFileRepository } from './upload-file.repository';

@Injectable()
export class UploadFileService {
  constructor(private uploadFileRepository: UploadFileRepository) { }
  async create(createUploadFileDto: CreateFileDto) {
    try {
      const csvData = await parseCSV(createUploadFileDto.file.buffer);

      const validateCsv = validateCsvFormat(csvData);

      if (validateCsv) throw new Error(validateCsv);

      const pendingAccounts = csvData.length - 1;

      const response = await this.uploadFileRepository.create(createUploadFileDto, pendingAccounts);

      for await (const record of csvData.slice(1)) {
        try {
          await this.processRecord(response.id, record);
        } catch (error) {
          console.error(`Error processing record: ${error.message}`);
          await this.uploadFileRepository.updateStatus(response.id, "failed")
        }
      }

      return response;
    } catch (error) {
      throw new Error(error)
    }
  }

  async startAsyncProcessing(fileId: number, csvData: any[]): Promise<void> {
    for await (const record of csvData.slice(1)) {
      try {
        await this.processRecord(fileId, record);
      } catch (error) {
        console.error(`Error processing record: ${error.message}`);
        await this.uploadFileRepository.updateStatus(fileId, 'failed');
      }
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
      throw new Error(error)
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
      throw new Error(error)
    }
  }
}

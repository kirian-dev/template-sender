import { BadRequestException } from "@nestjs/common";
import * as csvParser from 'csv-parser';

export const csvFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(new BadRequestException('Only CSV files are allowed!'), false);
  }
  callback(null, true);
};

export const validateCsvFormat = (csvData: any[]): string | undefined => {
  if (csvData.length < 2) {
    return 'CSV must have at least two rows: headers and data.';
  }
}

export const parseCSV = async (buffer: Buffer): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = csvParser()
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
    stream.write(buffer);
    stream.end();
  });
}
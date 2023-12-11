import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, BadRequestException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import * as multer from 'multer';
import * as csvParser from 'csv-parser';
import { UploadFileService } from './upload-file.service';
import { CreateFileDto } from './dto/create-upload-file.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { IAuthUser } from 'src/common/interfaces/auth.interface';
import { csvFileFilter } from './helpers';

const storage = multer.memoryStorage();

@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) { }

  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter: csvFileFilter }))
  async create(@UploadedFile() file: Express.Multer.File, @AuthUser() user: IAuthUser, @Body() createFileDto:
    CreateFileDto
  ) {
    if (!file) {
      throw new BadRequestException('File is missing.');
    }
    const { userId } = user;
    return this.uploadFileService.create({ ...createFileDto, userId, file });
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @AuthUser() user: IAuthUser) {
    const { userId } = user;
    return this.uploadFileService.findOne(+id, userId);
  }

  @Auth()
  @Get()
  findAll(@AuthUser() user: IAuthUser) {
    return this.uploadFileService.findAll();
  }
}

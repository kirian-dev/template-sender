export class CreateFileDto {
  userId: number;
  emailText: string;
  file: Express.Multer.File;
}

import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('macropage-connect/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('tutorial')
  @UseInterceptors(FileInterceptor('file'))
  uploadTutorial(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded (field name: "file")');
    }
    return this.uploadService.uploadTutorial(file);
  }
}

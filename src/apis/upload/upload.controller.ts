import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

// npm i -D @types/multer
// npm i aws-sdk @nestjs/config

@Controller('/')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  //하나의 파일을 업로드
  @Post('upload')
  @UseInterceptors(FileInterceptor('profileImage'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.uploadService.uploadFileToS3('profileImage', file);
  }

  //여러개의 파일을 업로드
  @Post('upload')
  @UseInterceptors(FilesInterceptor('images'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  // @Post('cats')
  // getImageUrl(@Body('key') key: string) {
  //   return this.uploadService.getAwsS3FileUrl(key);
  // }
}

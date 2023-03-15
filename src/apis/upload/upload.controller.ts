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

//upload 할때 예시입니다.

@Controller('/')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Get()
  getHello() {
    return 'hello, aws s3';
  }
  //하나의 파일을 업로드
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file::::::', file);
    return await this.uploadService.uploadProfileImageToS3(
      'yumyumdb-test',
      file,
    );
  }

  // //여러개의 파일을 업로드
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    const promises = files.map((file) =>
      this.uploadService.uploadProfileImageToS3('yumyumdb-tests', file),
    );
    return await Promise.all(promises);
  }
}

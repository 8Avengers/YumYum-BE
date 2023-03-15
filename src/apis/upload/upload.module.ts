import { UploadService } from './upload.service';
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [UploadController],
  providers: [UploadService, TypeOrmModule],
  exports: [UploadService, TypeOrmModule],
})
export class UploadModule {}

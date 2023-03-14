import { UploadService } from './upload.service';
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [UploadController],
  providers: [UploadService, TypeOrmModule],
  exports: [UploadService],
})
export class UploadModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Post, ,])],
  controllers: [ReportController],
  providers: [ReportService, JwtService],
})
export class ReportModule {}

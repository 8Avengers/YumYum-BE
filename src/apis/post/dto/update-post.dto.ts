import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsString, IsArray } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsArray()
  @IsString({ each: true })
  readonly files?: string[];
}

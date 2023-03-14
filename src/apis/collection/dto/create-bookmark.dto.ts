import { IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsOptional()
  readonly type?: 'bookmark';

  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly image: string;

  @IsString()
  @IsOptional()
  visibility: 'public' | 'private';
}

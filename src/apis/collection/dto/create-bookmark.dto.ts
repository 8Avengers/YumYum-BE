import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty({ message: 'name은(는) 필수 입력 항목입니다.' })
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly type?: 'bookmark';

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly image?: string;

  @IsString()
  @IsOptional()
  visibility: 'public' | 'private';
}

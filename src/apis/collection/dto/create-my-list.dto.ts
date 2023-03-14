import { IsOptional, IsString } from 'class-validator';

export class CreateMyListDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly type?: 'myList';

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly image?: string;

  @IsString()
  @IsOptional()
  readonly visibility?: 'public' | 'private';
}

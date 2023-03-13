import { IsOptional, IsString } from 'class-validator';

export class UpdateMyListDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly image?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly visibility?: 'public' | 'private';
}

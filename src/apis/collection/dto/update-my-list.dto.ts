import { IsString } from 'class-validator';

export class UpdateMyListDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly image?: string;

  @IsString()
  readonly description?: string;

  @IsString()
  readonly visibility?: 'public' | 'private';
}

import { IsString } from 'class-validator';

export class CreateMyListDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly type: 'myList';

  @IsString()
  readonly description?: string;

  @IsString()
  readonly image?: string;

  @IsString()
  readonly visibility?: 'public' | 'private';
}

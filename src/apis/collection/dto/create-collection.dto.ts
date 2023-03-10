import { IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  readonly type: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly img: string;

  visibility: 'public' | 'private';
}

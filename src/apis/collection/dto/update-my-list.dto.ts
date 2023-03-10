import { IsString } from 'class-validator';

export class CreateMyListDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly img: string;
}

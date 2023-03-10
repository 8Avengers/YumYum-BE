import { IsString } from 'class-validator';

export class UpdateMyListDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly img: string;
}

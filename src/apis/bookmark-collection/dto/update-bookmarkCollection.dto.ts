import { IsString } from 'class-validator';

export class UpdateCollectionDto {
  @IsString()
  readonly name: string;
}

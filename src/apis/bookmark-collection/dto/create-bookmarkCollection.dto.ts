import { IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  readonly name: string;
}

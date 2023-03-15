import { IsNumber, IsArray } from 'class-validator';

export class DetailMylistDto {
  @IsNumber()
  collectionId: number;
}

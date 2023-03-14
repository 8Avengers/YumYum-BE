import { IsNumber, IsArray } from 'class-validator';

export class addCollectionPostingDto {
  @IsArray()
  collectionId: number[];
}

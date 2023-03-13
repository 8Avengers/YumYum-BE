import { IsNumber, IsArray } from 'class-validator';

export class CreateCollectionPostingDto {
  @IsArray()
  collectionId: number[];
}

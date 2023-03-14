import { IsNumber } from 'class-validator';

export class minusCollectionPostingDto {
  @IsNumber()
  collectionId: number;
}

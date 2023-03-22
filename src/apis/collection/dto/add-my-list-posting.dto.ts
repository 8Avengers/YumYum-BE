import { IsArray } from 'class-validator';

export class addCollectionPostingDto {
  @IsArray()
  collectionId: Array<number>;
}

import { IsNumber, IsArray } from 'class-validator';

export class BookmarPostDto {
  @IsNumber()
  collectionId: number;
}

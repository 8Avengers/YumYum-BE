import { IsNumber, IsArray } from 'class-validator';

export class BookmarRastaurantDto {
  @IsNumber()
  collectionId: number;
}

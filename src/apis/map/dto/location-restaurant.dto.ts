import { IsString } from 'class-validator';

export class LocationRestaurantDto {
  @IsString()
  readonly x: string;

  @IsString()
  readonly y: string;
}

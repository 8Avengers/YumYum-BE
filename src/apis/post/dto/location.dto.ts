import { IsString } from 'class-validator';

export class LocationDto {
  @IsString()
  readonly x: string;

  @IsString()
  readonly y: string;
}

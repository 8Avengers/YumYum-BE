/*

1. 맛집id +

2. 컬렉션에 대한 이름


*/

import { IsString } from 'class-validator';

export class CreateMyListDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly img: string;
}
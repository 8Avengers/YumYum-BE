import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: '제주특별자치도 서귀포시 성산읍 오조리 7-2',
    description: '지번 주소',
    required: true,
  })
  @IsString()
  readonly address_name: string;

  @ApiProperty({
    example: 'FD6',
    description: '카테고리 코드(카카오)',
    required: true,
  })
  @IsString()
  readonly category_group_code: string;

  @ApiProperty({
    example: '음식점',
    description: '카테고리 그룹 이름(카카오)',
    required: true,
  })
  @IsString()
  readonly category_group_name: string;

  @ApiProperty({
    example: '음식점 > 한식 > 육류,고기',
    description: '카테고리 이름(카카오)',
    required: true,
  })
  @IsString()
  readonly category_name: string;

  @ApiProperty({
    example: '1896620216',
    description: '가게 ID (카카오)',
    required: true,
  })
  @IsString()
  readonly kakao_place_id: string;

  @ApiProperty({
    example: "'064-782-7330' 이거나 빈값",
    description: '가게 전화번호',
    required: true,
  })
  @IsString()
  readonly phone: string;

  @ApiProperty({
    example: '복자씨 연탄구이',
    description: '가게 이름',
    required: true,
  })
  @IsString()
  readonly place_name: string;

  @ApiProperty({
    example: '제주특별자치도 서귀포시 성산읍 한도로 124',
    description: '도로명 주소',
    required: true,
  })
  @IsString()
  readonly road_address_name: string;

  @ApiProperty({
    example: '126.921242446619',
    description: '경도',
    required: true,
  })
  @IsString()
  readonly x: string;

  @ApiProperty({
    example: '33.4685316070004',
    description: '위도',
    required: true,
  })
  @IsString()
  readonly y: string;
}

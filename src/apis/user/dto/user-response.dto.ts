import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UserDto {
  @ApiProperty({ type: String, description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'Password of the user' })
  @Length(60)
  password: string;

  @ApiProperty({ type: String, description: 'Nickname of the user' })
  @IsString()
  nickname: string;

  @ApiProperty({ type: String, description: 'Name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: 'Gender of the user (M or F)' })
  @Matches(/^(M|F)$/)
  gender: 'M' | 'F';

  @ApiProperty({
    type: String,
    description: 'Birth date of the user in the format of YYYYMMDD',
  })
  @Matches(/^\d{8}$/)
  birth: string;

  @ApiProperty({
    type: String,
    description: 'Phone number of the user in the format of 11 digits',
  })
  @Matches(/^\d{11}$/)
  phone_number: string;

  @ApiProperty({ type: String, description: 'Profile image of the user' })
  @IsString()
  profile_image: string;

  @ApiProperty({
    type: String,
    description: 'Introduction of the user',
    required: false,
  })
  @IsString()
  introduce?: string;

  @ApiProperty({ type: Number, description: 'ID of the user' })
  id: number;

  @ApiProperty({ type: Number, description: 'Number of followers of the user' })
  followerCount: number;

  @ApiProperty({ type: Number, description: 'Number of following of the user' })
  followingCount: number;

  @ApiProperty({
    type: String,
    description: 'Creation date and time of the user',
  })
  created_at: string;

  @ApiProperty({
    type: String,
    description: 'Last update date and time of the user',
  })
  updated_at: string;
}

// import { PickType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class OauthUserDto extends PickType(CreateUserDto, [
//   'email',
//   'nickname',
//   'name',
// ]) {}

export class OauthUserDto {
  readonly name?: string;

  readonly email?: string;

  readonly nickname?: string;
}

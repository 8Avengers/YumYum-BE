import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';

/* TODO: 세준님 요청사항 

profile/1  ⇒ 상대방 프로필 조회하기 + 나의 프로필일수 있다. 
= 모든 유저의 프로필입니다. 

/me  ⇒ 나의 정보 조회하기


*/

@Controller()
export class profileController {
  constructor(private readonly profileService: ProfileService) {}
}

//profile/:id

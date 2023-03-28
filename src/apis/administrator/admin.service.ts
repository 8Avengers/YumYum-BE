import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /*
    ### 23.03.27
    ### 최호인, 표정훈
    ### 유저 강제탈퇴 기능
    */
  async userWithdrawal(userId: number) {
    try {
      const result = await this.userRepository.softDelete(userId);
      if (result.affected === 0) {
        throw new NotFoundException('해당 유저가 없습니다.');
      }
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.27
    ### 최호인, 표정훈
    ### 유저 정지 기능 3일 7일 1달 삭제 => 킹호인!
    */
  async userBanLists(userId: number) {
    try {
      // 1. 정지를 시켰을때, conut를 확인하여 정지일 수를 정한다.
      const userBan = await this.userRepository.findOne({
        where: { id: userId, deleted_at: null },
        select: { deleted_at: true },
      });

      // 2. 정지일수가 지나면 다시 NULL로 변경한다. 타이머?
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.27
    ### 최호인, 표정훈
    ### 레스토랑 정보수정
    */
  async updateRestaurant(userId: number) {
    try {
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
  /*
    ### 23.03.27
    ### 최호인, 표정훈
    ### 포스트 삭제
    */
  async deletePost(postId: number) {
    try {
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.27
    ### 최호인, 표정훈
    ### 코멘트 삭제
    */
  async deleteComment(commentId: number) {
    try {
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  //
}

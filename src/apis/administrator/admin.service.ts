import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { Comment } from '../comment/entities/comment.entity';
import { LessThan, Repository } from 'typeorm';
import { Reports } from '../report/entities/report.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Reports) private reportRepository: Repository<Reports>,
  ) {}

  /*
    ### 23.03.27
    ### 최호인, 표정훈
    ### 유저 정지 기능 3일 7일 1달 삭제 !
    */
  async userBan(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      let banCount = user.banCount;

      let days = 0;
      if (banCount > 2) {
        banCount = 2;
      }
      switch (banCount) {
        case 0:
          days = 3;
          break;
        case 1:
          days = 7;
          break;
        case 2:
          days = 30;
          break;
        default:
          throw new InternalServerErrorException('Invalid ban count');
      }

      const now = new Date();
      const banExpiration = new Date(
        now.getTime() + days * 24 * 60 * 60 * 1000,
      );

      await this.userRepository.update(
        { id: userId },
        {
          isBanned: true,
          banCount: banCount + 1,
          banExpiration: banExpiration,
        },
      );

      return { message: '유저 정지 성공' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async liftBanOnExpiredUsers() {
    const now = new Date();
    const expiredBans = await this.userRepository.find({
      where: { banExpiration: LessThan(now) },
    });

    for (const user of expiredBans) {
      await this.userRepository.update({ id: user.id }, { isBanned: false });
    }
  }

  /*
    ### 23.03.30
    ### 최호인, 표정훈
    ### 신고 내역
    */

  // 유저, 포스트, 코멘트에 신고 내역을 보여주는 곳
  async getReportLists(type: 'user' | 'comment' | 'post') {
    return await this.reportRepository.find({
      where: { type },
    });
  }

  /*
    ### 23.03.30
    ### 최호인, 표정훈
    ### 유저 정지기간 확인
    */

  async getBanExpiration(userId: number) {
    return await this.userRepository.find({
      where: {
        id: userId,
      },
      select: {
        banExpiration: true,
      },
    });
  }

  /*
    ### 23.03.27
    ### 최호인, 표정훈
    ### 유저 강제탈퇴 기능
    */
  // async userWithdrawal(userId: number) {
  //   try {
  //     const result = await this.userRepository.softDelete(userId);
  //     if (result.affected === 0) {
  //       throw new NotFoundException('해당 유저가 없습니다.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     throw new InternalServerErrorException(
  //       'Something went wrong while processing your request. Please try again later.',
  //     );
  //   }
  // }

  // /*
  //   ### 23.03.27
  //   ### 최호인, 표정훈
  //   ### 포스트 삭제
  //    */
  // async deletePost(postId: number) {
  //   try {
  //     const result = await this.postRepository.softDelete(postId);
  //     if (result.affected === 0) {
  //       throw new NotFoundException('존재하지 않는 포스트입니다.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     throw new InternalServerErrorException(
  //       'Something went wrong while processing your request. Please try again later.',
  //     );
  //   }
  // }

  // /*
  //   ### 23.03.27
  //   ### 최호인, 표정훈
  //   ### 코멘트 삭제
  //   */
  // async deleteComment(commentId: number) {
  //   try {
  //     const result = await this.commentRepository.softDelete(commentId);
  //     if (result.affected === 0) {
  //       throw new NotFoundException('존재하지 않는 코멘트입니다.');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     throw new InternalServerErrorException(
  //       'Something went wrong while processing your request. Please try again later.',
  //     );
  //   }
  // }
}

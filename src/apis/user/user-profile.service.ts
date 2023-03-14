import { UploadService } from './../upload/upload.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm'; //데이터들어갈떄
import { InjectRepository } from '@nestjs/typeorm'; //데이터들어갈떄
import { User } from './entities/user.entity'; //데이터들어갈떄
import { Follow } from './entities/follow.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(User) //데이터들어갈떄
    private readonly userRepository: Repository<User>, //데이터들어갈떄

    @InjectRepository(Follow)
    private FollowRepository: Repository<Follow>,

    private readonly uploadService: UploadService,
  ) {}

  //유저이메일로 찾기
  async findByEmail({ email }) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  //유저아이디로 찾기
  async getUserById(id) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      console.log('getUserById의 id는?', id);

      if (!user) {
        throw new NotFoundException('존재하지 않는 유저입니다.');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  //유저닉네임으로 찾기
  async getUserByNickname(nickname: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { nickname },
      });

      console.log('getUserById의 id는?', nickname);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  //유저프로필 수정하기
  async updateUserProfile({ updateUserProfileDto, user, file }) {
    const existUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!existUser) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (existUser) {
      existUser.nickname = updateUserProfileDto.nickname;
      existUser.introduce = updateUserProfileDto.introduce;
      if (file) {
        const uploadedFile = await this.uploadService.uploadProfileImageToS3(
          'yumyumdb-profile', //AmazonS3의 저장되는 폴더명
          file,
        );

        console.log(
          'uploadProfileImageToS3의 리턴값 uploadedFile',
          uploadedFile,
        );

        console.log('existUser::::', existUser);

        existUser.profile_image = uploadedFile.profileImage; //업데이트
      } else {
        existUser.profile_image = existUser.profile_image; //노 업데이트
      }

      const updatedUserProfile = await this.userRepository.save(existUser);
      console.log('업데이트완료후!updatedUserProfile::', updatedUserProfile);

      return {
        nickname: updatedUserProfile.nickname,
        introduce: updatedUserProfile.introduce,
        profileImage: updatedUserProfile.profile_image,
      };
    }
  }

  //유저 탈퇴하기 TypeORM이 제공하는 SoftDelete
  async deleteUser(user) {
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!existingUser) {
      throw new UnprocessableEntityException('존재하지 않는 유저입니다..');
    }
    const result = await this.userRepository.softDelete({ id: user.id });
    console.log(result);
    return result.affected ? true : false;
  }

  //팔로우하기
  public async createUserFollowRelation(follower: User, followingId: number) {
    try {
      console.log(
        'follower of the service, follwingId',
        follower.id,
        followingId,
      );

      const following = await this.getUserById(followingId);
      console.log('The value of following in service is', following);

      if (!following) {
        throw new NotFoundException('User not found');
      }
      const newFollow = await this.FollowRepository.save({
        follower,
        following,
      });
      return newFollow.following;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  //팔로우취소하기
  public async deleteUserFollowRelation(follower: User, followingId: number) {
    const id: number = followingId;
    const following = await this.getUserById(id);
    console.log('following반환값', following); // 여기까지는 옴
    console.log('서비스의 follower, followingID', follower, followingId); // 여기까지는 옴

    if (!following) {
      throw new NotFoundException('User not found');
    }
    console.log('여기오나1');

    // const follow = await this.FollowRepository.findOne({
    //   where: { follower, following },
    // });

    // const follow = await this.FollowRepository.findOne({
    //   where: { follower: follower, following: { id: followingId } },
    // });

    const follow = await this.FollowRepository.query(
      'SELECT * FROM follow WHERE follower_id = ? AND following_id = ?',
      [follower.id, Number(followingId)],
    );

    console.log('follow 테이블의 id는?', follow);

    console.log('여기오나2');
    try {
      const follow = await this.FollowRepository.query(
        'SELECT * FROM follow WHERE follower_id = ? AND following_id = ?',
        [follower.id, Number(followingId)],
      );
      console.log('follow 테이블의 id는?', follow);
      console.log('여기오나2');
      if (follow) {
        const result = await this.FollowRepository.query(
          'DELETE FROM follow WHERE id = ?',
          [follow[0].id],
        );
        if (result.affectedRows === 1) {
          return following;
        } else {
          throw new Error('Failed to delete follow relationship');
        }
      } else {
        throw new NotFoundException('No follow relationship found');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete follow relationship',
      );
    }
  }

  //팔로워조회하기
  async getFollowers(userId: number): Promise<User[]> {
    try {
      const follows = await this.FollowRepository.find({
        where: { following: { id: userId } },
        relations: ['follower'],
      });
      return follows.map((follow) => follow.follower);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to retrieve followers for user with id ${userId}.`,
      );
    }
  }

  //팔로잉조회하기
  async getFollowings(userId: number): Promise<User[]> {
    try {
      const follows = await this.FollowRepository.find({
        where: { follower: { id: userId } },
        relations: ['following'],
      });
      return follows.map((follow) => follow.following);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to retrieve followings for user with id ${userId}.`,
      );
    }
  }
}

import { UploadService } from './../upload/upload.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

        existUser.profile_image = uploadedFile.profileImage; //이미지를 업로드 하셔서 업데이트
      } else {
        existUser.profile_image = existUser.profile_image; //이미지를 업로드하지 않으셔서 노 업데이트
      }

      const updatedUserProfile = await this.userRepository.save(existUser);
      console.log('업데이트완료후!updatedUserProfile::', updatedUserProfile);

      return {
        id: updatedUserProfile.id,
        nickname: updatedUserProfile.nickname,
        introduce: updatedUserProfile.introduce,
        profile_image: updatedUserProfile.profile_image,
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

    // const passwordMatch = await this.comparePasswords(
    //   password,
    //   existingUser.password,
    // );

    // if (!passwordMatch) {
    //   throw new UnprocessableEntityException('Incorrect password provided.');
    // }

    try {
      const result = await this.userRepository.softDelete({ id: user.id });
      console.log('result결과값', result);
      return result.affected ? true : false;
    } catch (error) {
      console.error('Error in soft deleting the user:', error);
      throw new InternalServerErrorException(
        'An error occurred while soft deleting the user.',
      );
    }
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // 팔로우 상태 확인하기
  async checkUserFollowRelation(
    followerId: number,
    followingId: number,
  ): Promise<boolean> {
    const follow = await this.FollowRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    return !!follow;
  }

  // 현재 팔로우 관계에 따라 팔로우 언팔로우 실행하기

  async followUser(follower: User, followingId: number): Promise<User> {
    const followingUser = await this.getUserById(followingId);

    if (!followingUser) {
      throw new NotFoundException('User not found');
    }

    const existingFollow = await this.getFollowByFollowerAndFollowingIds(
      follower.id,
      followingId,
    );

    if (existingFollow) {
      await this.deleteUserFollowRelation(follower, followingId);
      return followingUser;
    } else {
      await this.createUserFollowRelation(follower, followingId);
      return followingUser;
    }
  }

  async getFollowByFollowerAndFollowingIds(
    followerId: number,
    followingId: number,
  ): Promise<Follow> {
    return await this.FollowRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
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

    try {
      const follow = await this.FollowRepository.query(
        'SELECT * FROM follow WHERE follower_id = ? AND following_id = ?',
        [follower.id, Number(followingId)],
      );
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

  //유저의 팔로워 조회하기
  async getFollowers(
    userId: number,
    page: string,
  ): Promise<{ id: number; nickname: string; profile_image: string }[]> {
    try {
      const pageNum = Number(page) - 1;
      const follows = await this.FollowRepository.find({
        where: { following: { id: userId } },
        relations: ['follower'],
        skip: pageNum * 15,
        take: 15,
      });
      const result = follows.map((follow) => ({
        id: follow.follower.id,
        nickname: follow.follower.nickname,
        profile_image: follow.follower.profile_image,
      }));

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to retrieve followers for user with id ${userId}.`,
      );
    }
  }

  //유저의 팔로잉 조회하기
  async getFollowings(
    userId: number,
    page: string,
  ): Promise<{ id: number; nickname: string; profile_image: string }[]> {
    try {
      const pageNum = Number(page) - 1;
      const follows = await this.FollowRepository.find({
        where: { follower: { id: userId } },
        relations: ['following'],
        skip: pageNum * 15,
        take: 15,
      });
      const result = follows.map((follow) => ({
        id: follow.following.id,
        nickname: follow.following.nickname,
        profile_image: follow.following.profile_image,
      }));

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to retrieve followings for user with id ${userId}.`,
      );
    }
  }
}

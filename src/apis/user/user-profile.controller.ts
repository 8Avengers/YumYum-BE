import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Param,
  Get,
  Delete,
  Put,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { User } from './entities/user.entity';
import { DeleteUser, UpdateUserProfile } from './user.decorators';
import { UploadService } from '../upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PostService } from '../post/post.service';

@ApiTags('유저프로필/팔로우/팔로잉')
@Controller('/profile')
export class UserProfileController {
  constructor(
    private readonly userService: UserProfileService, //
    private readonly uploadService: UploadService, //
    private readonly postService: PostService,
  ) {}

  //나의프로필 보기 얘는 항상 제일 위에 있어야 한다. 아니면 이상한 에러나온다.
  @Get('/me')
  @UseGuards(AuthAccessGuard)
  async getMyProfile(@CurrentUser() user: User) {
    const myProfile = await this.userService.getUserById(user.id);
    console.log(myProfile);

    const response = {
      id: myProfile.id,
      nickname: myProfile.nickname,
      profileImage: myProfile.profile_image,
    };

    return response;
  }

  //유저프로필 수정하기
  @Put('/me')
  @UpdateUserProfile()
  @UseGuards(AuthAccessGuard)
  @UseInterceptors(FileInterceptor('file')) //files d
  async updateMyProfile(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) updateUserProfileDto: UpdateUserProfileDto,
  ) {
    console.log('포스맨통과하면여기찍힌다.file::::::', file);
    //포스트맨으로 하면, 사진 자체가 받아지지 않는다. 뭐가 문제일까?

    const updatedUserProfile = await this.userService.updateUserProfile({
      user,
      updateUserProfileDto,
      file,
    });

    const response = {
      nickname: updatedUserProfile.nickname,
      introduce: updatedUserProfile.introduce,
      profileImage: updatedUserProfile.profileImage,
    };

    return response;
  }

  //유저 탈퇴하기(소프트딜리트)
  @DeleteUser()
  @UseGuards(AuthAccessGuard)
  @Delete('/me')
  async deleteUser(@CurrentUser() user: any): Promise<Boolean> {
    try {
      return await this.userService.deleteUser(user);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  //유저아이디로 유저프로필 불러오기
  @Get('/:userId')
  async getUserProfile(@Param('userId') userId: number) {
    const user = await this.userService.getUserById(userId);

    const response = {
      id: user.id,
      nickname: user.nickname,
      introduce: user.introduce,
      profileImage: user.profile_image,
    };

    return response;
  }

  //그 사람이 작성한 모든 포스트들
  @Get('/:userId/posts')
  async getUserIdPosts(@Param('userId') userId: number) {
    const allPostsByUserId = await this.postService.getPostsByUserId(userId);

    return allPostsByUserId;
  }

  //유저팔로우하기
  @UseGuards(AuthAccessGuard)
  @Post('/:userId/follow')
  async followUser(
    @CurrentUser() follower: User,
    @Param('userId') followingId: number, // : Promise<User>
  ) {
    console.log('Follower follower, followingId', follower.id, followingId);
    const followerId = follower.id;

    try {
      const followingUser = await this.userService.createUserFollowRelation(
        follower,
        followingId,
      );
      const response = {
        id: followingUser.id,
        nickname: followingUser.nickname,
        introduce: followingUser.introduce,
        profileImage: followingUser.profile_image,
      };

      return response;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Invalid user id');
    }
  }

  //유저팔로잉취소하기
  @UseGuards(AuthAccessGuard)
  @Delete('/:userId/follow')
  async unfollowUser(
    @CurrentUser() follower: User,
    @Param('userId') followingId: number,
  ): Promise<User> {
    const unfollowedUser = await this.userService.deleteUserFollowRelation(
      follower,
      followingId,
    );
    return unfollowedUser;
    // return follower
  }

  //유저의 팔로워 불러오기
  @Get('/:userId/followers')
  async getFollowersOfUser(@Param('userId') userId: number): Promise<User[]> {
    return this.userService.getFollowers(userId);
  }

  //유저의 팔로잉 불러오기
  @Get('/:userId/followings')
  async getFollowingsOfUser(@Param('userId') userId: number): Promise<User[]> {
    return this.userService.getFollowings(userId);
  }
}

//닉네임으로 유저프로필 불러오기 => 실제서비스처럼하고 싶다.
// @Get('/:nickname')
// async getUserProfile(@Param('nickname') nickname: string) {
//   const user = await this.userService.getUserByNickname(nickname);
//   return user;
// }

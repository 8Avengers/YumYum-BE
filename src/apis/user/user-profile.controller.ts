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
  NotFoundException,
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
import { DeleteUserDto } from './dto/delete-user.dto';

@ApiTags('유저프로필/팔로우/팔로잉')
@Controller('/profile')
export class UserProfileController {
  constructor(
    private readonly userService: UserProfileService, //
    private readonly postService: PostService,
  ) {}

  //나의프로필 보기
  //나의프로필 보기는 항상 제일 위에 있어야 한다. 아니면 이상한 에러나온다.
  @Get('/me')
  @UseGuards(AuthAccessGuard)
  async getMyProfile(@CurrentUser() user: User) {
    const myProfile = await this.userService.getUserById(user.id);
    console.log(myProfile);

    const response = {
      id: myProfile.id,
      nickname: myProfile.nickname,
      introduce: myProfile.introduce,
      profile_image: myProfile.profile_image,
    };

    return response;
  }

  //나의프로필 수정하기
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
      id: updatedUserProfile.id,
      nickname: updatedUserProfile.nickname,
      introduce: updatedUserProfile.introduce,
      profile_image: updatedUserProfile.profile_image,
    };

    return response;
  }

  //유저 탈퇴하기 TypeORM이 제공하는 SoftDelete
  @DeleteUser()
  @UseGuards(AuthAccessGuard)
  @Delete('/me')
  async deleteUser(
    @CurrentUser() user: any,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<Boolean> {
    try {
      return await this.userService.deleteUser(user, deleteUserDto.password);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  //다른사람의 프로필보기
  @Get('/:userId')
  @UseGuards(AuthAccessGuard)
  async getUserProfile(
    @Param('userId') userId: number,
    @CurrentUser() currentUser?: User,
  ) {
    const userProfile = await this.userService.getUserById(userId);

    let followStatus = null;
    if (currentUser) {
      if (currentUser.id === userId) {
        followStatus = 'me';
      } else {
        followStatus = await this.userService.checkUserFollowRelation(
          currentUser.id,
          userId,
        );
      }
    }

    console.log('followStatus', followStatus);

    const response = {
      id: userProfile.id,
      nickname: userProfile.nickname,
      introduce: userProfile.introduce,
      profile_image: userProfile.profile_image,
      follow_relationship:
        followStatus === true
          ? 'True'
          : followStatus === false
          ? 'False'
          : followStatus,
    };

    return response;
  }

  //그 사람이 작성한 모든 포스트들
  @Get('/:userId/posts')
  async getUserIdPosts(@Param('userId') userId: number) {
    const allPostsByUserId = await this.postService.getPostsByUserId(userId);

    return allPostsByUserId;
  }

  // 유저 팔로우 하기 & 언팔로우 하기
  @UseGuards(AuthAccessGuard)
  @Post('/:userId/follow')
  async followUser(
    @CurrentUser() follower: User,
    @Param('userId') followingId: number,
  ): Promise<string> {
    const followingUser = await this.userService.getUserById(followingId);

    if (!followingUser) {
      throw new NotFoundException('User not found');
    }

    const existingFollow =
      await this.userService.getFollowByFollowerAndFollowingIds(
        follower.id,
        followingId,
      );

    if (existingFollow) {
      await this.userService.deleteUserFollowRelation(follower, followingId);
      return `${follower.nickname}님이 ${followingUser.nickname}님을 언팔로우하였어요`;
    } else {
      await this.userService.createUserFollowRelation(follower, followingId);
      return `${follower.nickname}님이 ${followingUser.nickname}님을 팔로우하였어요`;
    }
  }

  //유저의 팔로워 조회하기
  @Get('/:userId/followers')
  async getFollowersOfUser(
    @Param('userId') userId: number,
  ): Promise<{ id: number; nickname: string; profile_image: string }[]> {
    const userIdFollowers = await this.userService.getFollowers(userId);
    return userIdFollowers;
  }

  //유저의 팔로잉 조회하기
  @Get('/:userId/followings')
  async getFollowingsOfUser(
    @Param('userId') userId: number,
  ): Promise<{ id: number; nickname: string; profile_image: string }[]> {
    const userIdFollowings = await this.userService.getFollowings(userId);
    return userIdFollowings;
  }
}

//닉네임으로 유저프로필 불러오기 => 실제서비스처럼하고 싶다.
// @Get('/:nickname')
// async getUserProfile(@Param('nickname') nickname: string) {
//   const user = await this.userService.getUserByNickname(nickname);
//   return user;
// }

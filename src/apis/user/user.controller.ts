import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UseGuards,
    Param,
    Get,
    Put,
    Delete,
  } from '@nestjs/common';
  // import {
  //  FollowApi
  // } from '@nestjs/swagger';
  import { UserService } from './user.service';
  import * as bcrypt from 'bcrypt';
  import { CreateUserDto } from './dto/create-user.dto';
  import { CurrentUser } from 'src/common/decorators/current-user.decorator';
  import { AuthAccessGuard } from '../auth/guards/auth.guards';
  import { User } from './entities/user.entity';
  
  @Controller('/')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post('/signup')
    async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
      const {
        email,
        password,
        nickname,
        name,
        gender,
        birth,
        phoneNumber,
        profileImage,
      } = createUserDto;
      console.log(createUserDto);
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      return this.userService.createUser({
        email,
        hashedPassword,
        nickname,
        name,
        gender,
        birth,
        phoneNumber,
        profileImage,
      });
    }
  
    @Get('/me')
    @UseGuards(AuthAccessGuard)
    async me(@CurrentUser() user: User) {
      return user;
    }
    @Get('/:id')
    async view(@Param('id') id: string) {
      const user = await this.userService.getUserById(id);
      return user;
    }



    // @FollowApi()
    @UseGuards(AuthAccessGuard)  // jwt-access.strategy.ts user 정보가 payload로 나온다. {email: 'email@naver.com', id: 4, profileImage: 'sadasdsads', iat: 1678457539, exp: 1679667139}
    @Post('/:userid/follow')
    async followUser(
      @CurrentUser() follower: User, // current-user.decorator.ts 현재 유저를 req.user로 찍어준다. {email: 'email@naver.com', id: 4, profileImage: 'sadasdsads'}
      @Param('userid') followingId: string,
    ): Promise<User> {

      console.log("컨트롤러의 follower, follwingId", follower.id, followingId)
      const followerId = follower.id
      
      const followingUser = await this.userService.createUserFollowRelation(
        follower,
        followingId,
      );

      return followingUser;
    }
  
    // @FollowApi()
    @UseGuards(AuthAccessGuard)
    @Delete('/:userid/follow')
    async unfollowUser(
      @CurrentUser() follower: User,
      @Param('userid') followingId: string,
    ): Promise<User> {
      const unfollowedUser = await this.userService.deleteUserFollowRelation(
        follower,
        followingId,
      );
      return unfollowedUser;
      // return follower
    }
  
    // @FollowApi()
    @UseGuards(AuthAccessGuard)
    @Get('/:userid/followers')
    async getFollowersOfUser(): Promise<User[]> {
      return [];
    }
  
    // @FollowApi()
    @UseGuards(AuthAccessGuard)
    @Put('/:userid/followings')
    async getfollowingsOfUser(): Promise<User[]> {
      return [];
    }


  }
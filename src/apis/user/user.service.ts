import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'; //데이터들어갈떄
import { InjectRepository } from '@nestjs/typeorm'; //데이터들어갈떄
import { ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity'; //데이터들어갈떄
import { Collection } from '../collection/entities/collection.entity';
import { AuthService } from '../auth/auth.service';
import { Follow } from './entities/follow.entity';
 
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) //데이터들어갈떄
    private readonly userRepository: Repository<User>, //데이터들어갈떄

    @InjectRepository(Follow)
    private FollowRepository: Repository<Follow>,

    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,



  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserById(id) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

     console.log("getUserById의 id는?", id)

      if (!user) {
        throw new NotFoundException('User not found');
      }
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser({
    email,
    hashedPassword,
    nickname,
    name,
    gender,
    birth,
    profileImage,
    phoneNumber,
  }) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) throw new ConflictException('이미 등록된 이메일입니다.');

      const nicknameExists = await this.userRepository.findOne({
        where: { nickname },
      });

      if (nicknameExists)
        throw new ConflictException('이미 사용중인 nickname입니다.');

      const newUser = await this.userRepository.save({
        email,
        password: hashedPassword,
        nickname,
        name,
        gender,
        birth,
        phone_number: phoneNumber,
        profile_image: profileImage,
      });

      const collection = new Collection();
      collection.type = 'bookmark';
      collection.visibility = 'private';
      collection.user = newUser;
      await this.collectionRepository.save(collection);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async createOauthUser({ email, nickname, name }) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) throw new ConflictException('이미 등록된 이메일입니다.');

      const nicknameExists = await this.userRepository.findOne({
        where: { nickname },
      });

      if (nicknameExists)
        throw new ConflictException('이미 사용중인 nickname입니다.');

      const newUser = await this.userRepository.save({
        email,
        nickname,
        name,
      });

      //회원가입시 자동으로 bookmark의 모든게시물 collection이 private으로 생성
      const collection = new Collection();
      collection.type = 'bookmark';
      collection.visibility = 'private';
      collection.user = newUser;
      await this.collectionRepository.save(collection);

      return newUser;
    } catch (error) {
      throw error;
    }
  }



  // public async getUserByUserId(userId: string): Promise<User> {
  //   return await this.userRepository.findOne({ where: { id } });
  // }

  /**
   * create a user-user follow pairing
   */
  public async createUserFollowRelation(
    follower: User,
    followingId: number,
  ) {
    console.log("서비스의 follower, follwingId", follower.id, followingId)

    const following = await this.getUserById(followingId);
    console.log("service에서 following의 값은", following);

    if (!following) {
      throw new NotFoundException('User not found');
    }
    const newFollow = await this.FollowRepository.save({
      follower,
      following,
    });
    return newFollow.following;
  }

  /**
   * delete a user-user follow pairing
   */
  public async deleteUserFollowRelation(
    follower: User,
    followingId: number,
  ) {
    const id : number = followingId;
    const following = await this.getUserById(id);
    console.log("following반환값", following); // 여기까지는 옴 
    console.log("서비스의 follower, followingID", follower, followingId); // 여기까지는 옴 

    if (!following) {
      throw new NotFoundException('User not found');
    }
    console.log("여기오나1") 

    // const follow = await this.FollowRepository.findOne({
    //   where: { follower, following },
    // });

    // const follow = await this.FollowRepository.findOne({
    //   where: { follower: follower, following: { id: followingId } },
    // });
    

    const follow = await this.FollowRepository.query(
      'SELECT * FROM follow WHERE follower_id = ? AND following_id = ?',
      [follower.id, Number(followingId)]
    );
    

    console.log("follow 테이블의 id는?", follow)

    console.log("여기오나2")

    if (follow) {
      const result = await this.FollowRepository.query(
        'DELETE FROM follow WHERE id = ?',
        [follow[0].id]
      );
      if (result.affectedRows === 1) {
        // TODO: future: show show that I do not follow them anymore in the response
        return following;
      } else {
        throw new Error('Failed to delete follow relationship');
      }
    } else {
      throw new NotFoundException('No follow relationship found');
    }
    
    // if (follow) {
    //   await this.FollowRepository.delete(follow.id);
    //   // TODO: future: show show that I do not follow them anymore in the response
    //   return following;
    // } else {
    //   throw new NotFoundException('No follow relationship found');
    // }
  }



  async getFollowers(userId: number): Promise<User[]> {
    const follows = await this.FollowRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
    return follows.map((follow) => follow.follower);
  }
  


  async getFollowings(userId: number): Promise<User[]> {
    const follows = await this.FollowRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
    return follows.map((follow) => follow.following);
  }
   
 

}

 
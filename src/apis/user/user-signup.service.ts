import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'; //데이터들어갈떄
import { InjectRepository } from '@nestjs/typeorm'; //데이터들어갈떄
import { ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity'; //데이터들어갈떄
import { Collection } from '../collection/entities/collection.entity';

@Injectable()
export class UserSignupService {
  constructor(
    @InjectRepository(User) //데이터들어갈떄
    private readonly userRepository: Repository<User>, //데이터들어갈떄

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

      console.log('getUserById의 id는?', id);

      if (!user) {
        throw new NotFoundException('찾는 유저가 없습니다.');
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
    phoneNumber,
  }) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        withDeleted: true,
      });

      if (user) {
        if (user.deleted_at) {
          throw new ConflictException('이미 탈퇴한 회원입니다.');
        } else {
          throw new ConflictException('이미 등록된 이메일입니다.');
        }
      }

      const nicknameExists = await this.userRepository.findOne({
        where: { nickname },
      });

      if (nicknameExists)
        throw new ConflictException('이미 사용중인 nickname입니다.');

      const profileImageUrl =
        gender === 'M'
          ? 'https://yumyumdb.s3.ap-northeast-2.amazonaws.com/default-profile-image/male.jpg'
          : 'https://yumyumdb.s3.ap-northeast-2.amazonaws.com/default-profile-image/female.jpg';

      const newUser = await this.userRepository.save({
        email,
        password: hashedPassword,
        nickname,
        name,
        gender,
        birth,
        phone_number: phoneNumber,
        profile_image: profileImageUrl, // Save the profile image URL
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
}

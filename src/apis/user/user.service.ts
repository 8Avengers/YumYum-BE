import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'; //데이터들어갈떄
import { InjectRepository } from '@nestjs/typeorm'; //데이터들어갈떄
import { ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity'; //데이터들어갈떄

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) //데이터들어갈떄
    private readonly userRepository: Repository<User>, //데이터들어갈떄
  ) {}

  async findOne({ email }) {
    return await this.userRepository.findOne({
      where: { email },
    });
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

      return await this.userRepository.save({
        email,
        password: hashedPassword,
        nickname,
        name,
        gender,
        birth,
        phone_number: phoneNumber,
        profile_image: profileImage,
      });
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

      return await this.userRepository.save({
        email,
        nickname,
        name,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }
}

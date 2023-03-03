import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'; //데이터들어갈떄
import { InjectRepository } from '@nestjs/typeorm'; //데이터들어갈떄
import { User } from './entities/user.entity'; //데이터들어갈떄

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) //데이터들어갈떄
    private readonly userRepository: Repository<User>, //데이터들어갈떄
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
}

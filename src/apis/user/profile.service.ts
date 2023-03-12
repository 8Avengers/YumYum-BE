import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable() //이거 빼도 되지 않을까?
export class ProfileService {
  constructor(
    @InjectRepository(User) //데이터들어갈떄
    private readonly userRepository: Repository<User>, //데이터들어갈떄
  ) {}
}

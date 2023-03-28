import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
}

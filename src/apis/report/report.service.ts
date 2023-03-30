import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reports } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Reports) private userRepository: Repository<Reports>,
  ) {}
}

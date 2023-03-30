import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reports } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Reports) private reportRepository: Repository<Reports>,
  ) {}
  /*
    ### 23.03.30
    ### 최호인, 표정훈
    ### 신고 기능
    */
  async createReport(
    reporterId: number,
    reportedId: number,
    description: string,
    type: any,
  ) {
    await this.reportRepository.insert({
      reporterId,
      reportedId,
      description,
      type,
    });
  }
}

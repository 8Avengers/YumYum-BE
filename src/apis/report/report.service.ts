import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    type: 'user' | 'post' | 'comment',
  ) {
    try {
      const reportData: any = {
        description,
        type,
      };

      reportData.reporter = reporterId;

      if (type === 'user') {
        reportData.userId = reportedId;
      } else if (type === 'post') {
        reportData.postId = reportedId;
      } else if (type === 'comment') {
        reportData.commentId = reportedId;
      }

      await this.reportRepository.insert(reportData);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}

import { Body, Param, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { ReportService } from './report.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateReportDto } from './dto/create-reports.dto';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  /*
    ### 23.03.30
    ### 최호인, 표정훈
    ### 신고 기능 (컨트롤러만 3개)
    */
  @UseGuards(AuthAccessGuard)
  @Post('/')
  async createReport(
    @Body() data: CreateReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return await this.reportService.createReport(
      currentUser.id,
      data.reportedId,
      data.description,
      data.type,
    );
  }
}

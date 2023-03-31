import { Body, Param, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    ### 유저 신고 기능
    */
  @ApiOperation({ summary: '신고 기능' })
  @UseGuards(AuthAccessGuard)
  @ApiResponse({ status: 200, description: '신고 기능 성공' })
  @ApiResponse({ status: 400, description: '신고 기능 실패' })
  @Post('/:type')
  async createReport(
    @Param('type') type: 'user' | 'post' | 'comment',
    @Body() data: CreateReportDto,
    @CurrentUser() currentUser: any,
  ) {
    return await this.reportService.createReport(
      currentUser.id,
      data.reportedId,
      data.description,
      type,
      // data.type,
    );
  }

  // @UseGuards(AuthAccessGuard)
  // @Post('/post')
  // async createPostReport(
  //   @Body() data: CreateReportDto,
  //   @CurrentUser() currentUser: any,
  // ) {
  //   return await this.reportService.createReport(
  //     currentUser.id,
  //     data.reportedId,
  //     data.description,
  //     data.type,
  //   );
  // }

  // @UseGuards(AuthAccessGuard)
  // @Post('/comment')
  // async createCommentReport(
  //   @Body() data: CreateReportDto,
  //   @CurrentUser() currentUser: any,
  // ) {
  //   return await this.reportService.createReport(
  //     currentUser.id,
  //     data.reportedId,
  //     data.description,
  //     data.type,
  //   );
  // }
}

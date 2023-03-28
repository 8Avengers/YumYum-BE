import { Param, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { ReportService } from './report.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  /*
    ### 23.03.28
    ### 최호인, 표정훈
    ### 유저 신고
    */
  @UseGuards(AuthAccessGuard)
  @Post('/user/:reportedUserId')
  async createUserReport(
    @Param('reportedUserId') reportedUserId: number,
    @CurrentUser() currentUser: any,
  ) {}

  @UseGuards(AuthAccessGuard)
  @Post('/post/:reportedPostId')
  async createPostReport(
    @Param('reportedPostId') reportedPostId: number,
    @CurrentUser() currentUser: any,
  ) {}

  @UseGuards(AuthAccessGuard)
  @Post('/comment/:reportedCommentId')
  async createCommentReport(
    @Param('reportedCommentId') reportedCommentId: number,
    @CurrentUser() currentUser: any,
  ) {}
}

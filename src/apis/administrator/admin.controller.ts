import { Controller, UseGuards, Param, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { AdminService } from './admin.service';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  /*
    ### 23.03.30
    ### 최호인, 표정훈
    ### 유저 정지
    */
  @ApiOperation({ summary: '유저 정지' })
  @UseGuards(AuthAccessGuard)
  @ApiResponse({ status: 200, description: '유저 정지 성공' })
  @ApiResponse({ status: 400, description: '유저 정지 실패' })
  @Post('/add-ban-list/:userId')
  async userBan(@Param('userId') userId: number) {
    return await this.adminService.userBan(userId);
  }
  /*
    ### 23.03.30
    ### 최호인, 표정훈
    ### 신고 내역
    */
  @ApiOperation({ summary: '신고 내역' })
  @UseGuards(AuthAccessGuard)
  @ApiResponse({ status: 200, description: '신고 내역 성공' })
  @ApiResponse({ status: 400, description: '신고 내역 실패' })
  @Get('/:type')
  async getReportLists(@Param('type') type: 'user' | 'comment' | 'post') {
    return await this.adminService.getReportLists(type);
  }

  /*
    ### 23.03.30
    ### 최호인, 표정훈
    ### 정지 기간 확인
    */
  @ApiOperation({ summary: '신고 내역' })
  @UseGuards(AuthAccessGuard)
  @ApiResponse({ status: 200, description: '신고 내역 성공' })
  @ApiResponse({ status: 400, description: '신고 내역 실패' })
  @Get('/user/:userId')
  async getBanExpiration(@Param('userId') userId: number) {
    return await this.adminService.getBanExpiration(userId);
  }

  // /*
  //   ### 23.03.27
  //   ### 최호인, 표정훈
  //   ### 포스트 삭제
  //   */
  // @ApiOperation({ summary: '포스트 삭제' })
  // @UseGuards(AuthAccessGuard)
  // @ApiResponse({ status: 200, description: '포스트 삭제 성공' })
  // @ApiResponse({ status: 400, description: '포스트 삭제 실패' })
  // @Post('/delete-post/:postId')
  // async deletePost(@Param('postId') postId: number) {
  //   return await this.adminService.deletePost(postId);
  // }
  // /*
  //   ### 23.03.27
  //   ### 최호인, 표정훈
  //   ### 코멘트 삭제
  //   */
  // @ApiOperation({ summary: '댓글 삭제' })
  // @UseGuards(AuthAccessGuard)
  // @ApiResponse({ status: 200, description: '댓글 삭제 성공' })
  // @ApiResponse({ status: 400, description: '댓글 삭제 실패' })
  // @Post('/delete-comment/:commentId')
  // async deleteComment(@Param('commentId') commentId: number) {
  //   return await this.adminService.deleteComment(commentId);
  // }

  /*
    ### 23.03.27
    ### 최호인, 표정훈
    ### 유저 강제탈퇴
    */

  // 해당 유저의 정보를 소프트 딜리트한다.
  // 그러면 그때 모든 포스트, 댓글, 좋아요 등 날라가나?
  // @ApiOperation({ summary: '유저 강제탈퇴' })
  // @UseGuards(AuthAccessGuard)
  // @ApiResponse({ status: 200, description: '유저 강제탈퇴 성공' })
  // @ApiResponse({ status: 400, description: '유저 강제탈퇴 실패' })
  // @Post('/user-withdrawal/:userId')
  // async userWithdrawal(@Param('userId') userId: number) {
  //   return await this.adminService.userWithdrawal(userId);
  // }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /*
      ### 23.03.07
      ### 이드보라
      ### 특정 포스팅에 해당하는 모든 댓글 불러오기
     */
  @ApiOperation({ summary: '한 포스트의 모든 댓글 불러오기' })
  @Get()
  @UseGuards(AuthAccessGuard)
  async getAllComments(
    @Param('postId') postId: number,
    @CurrentUser() currentUser: any,
    @Query('page') page: string,
  ) {
    return await this.commentService.getAllComments(
      postId,
      currentUser.id,
      page,
    );
  }

  /*
      ### 23.03.07
      ### 이드보라
      ### 댓글 작성
     */
  @ApiOperation({ summary: '댓글 작성' })
  @Post()
  @UseGuards(AuthAccessGuard)
  createComment(
    @Param('postId') postId: number,
    @Body() data: CreateCommentDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.commentService.createComment(
      postId,
      currentUser.id,
      data.content,
    );
  }

  /*
      ### 23.03.07
      ### 이드보라
      ### 댓글 수정
     */
  @ApiOperation({ summary: '댓글 수정' })
  @Put(':commentId')
  @UseGuards(AuthAccessGuard)
  async updateComment(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
    @Body() data: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(postId, commentId, data.content);
  }

  /*
       ### 23.03.07
       ### 이드보라
       ###댓글 삭제
     */
  @ApiOperation({ summary: '댓글 수정' })
  @Delete(':commentId')
  @UseGuards(AuthAccessGuard)
  async deleteComment(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.commentService.deleteComment(postId, commentId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /*
      ### 23.03.07
      ### 이드보라
      ### 특정 포스팅에 해당하는 모든 댓글 불러오기
     */
  @Get()
  async getAllComments(@Param('postId') postId: number) {
    return await this.commentService.getAllComments(postId);
  }

  /*
      ### 23.03.07
      ### 이드보라
      ### 댓글 작성
     */
  @Post()
  createComment(
    @Param('postId') postId: number,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentService.createComment(postId, data.content);
  }

  /*
      ### 23.03.07
      ### 이드보라
      ### 댓글 수정
     */
  @Put(':commentId')
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
  @Delete(':commentId')
  async deleteComment(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.commentService.deleteComment(postId, commentId);
  }
}

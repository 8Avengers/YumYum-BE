import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import { Comment } from './comment.entity';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.commentLikes)
  @JoinColumn()
  user: User;

  @ManyToOne(type => Comment, comment => comment.commentLikes)
  @JoinColumn()
  comment: Comment;
}
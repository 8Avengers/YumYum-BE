import { User } from 'src/apis/user/entities/user.entity';
import { Comment } from './comment.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class CommentUserTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.commentUserTags)
  @JoinColumn()
  user: User;

  @ManyToOne(type => Comment, comment => comment.commentUserTags)
  @JoinColumn()
  comment: Comment;
}


/*TODO: 댓글에 회원태그 몇:몇 관계인지 다시 확인하자.*/
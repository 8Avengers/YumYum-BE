import { User } from '../../user/entities/user.entity';
import { Comment } from './comment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class CommentUserTag {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne((type) => User, (user) => user.commentUserTags)
  @JoinColumn()
  user: User;

  @ManyToOne((type) => Comment, (comment) => comment.commentUserTags)
  @JoinColumn()
  comment: Comment;
}

/*TODO: 댓글에 회원태그 몇:몇 관계인지 다시 확인하자.*/

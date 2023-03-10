import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommentLike } from './comment-like.entity';
import { CommentUserTag } from './comment-usertag.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne((type) => User, (user) => user.comments)
  @JoinColumn()
  user: User;

  @ManyToOne((type) => Post, (post) => post.comments)
  @JoinColumn()
  post: Post;

  @OneToMany(
    (type) => CommentUserTag,
    (commentUserTags) => commentUserTags.user,
  )
  commentUserTags: CommentUserTag[];

  @OneToMany((type) => CommentLike, (commentLikes) => commentLikes.comment)
  commentLikes: CommentLike[];
}

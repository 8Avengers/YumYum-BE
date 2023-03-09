import { Post } from 'src/apis/post/entities/post.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
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
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

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

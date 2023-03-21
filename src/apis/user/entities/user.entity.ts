import { Post } from '../../post/entities/post.entity';
import { PostLike } from '../../post/entities/post-like.entity';
import { Comment } from '../../comment/entities/comment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PostUserTag } from '../../post/entities/post-usertag.entity';
import { CommentLike } from '../../comment/entities/comment-like.entity';
import { CommentUserTag } from '../../comment/entities/comment-usertag.entity';
import { IsEnum } from 'class-validator';

import { Collection } from '../../collection/entities/collection.entity';
@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  @Column({ nullable: true })
  birth: Date;

  @Column({ nullable: true, length: 100 })
  introduce: string;

  //TODO: 회원가입시 default 이미지로값으로 가입완료
  @Column({ nullable: true })
  profile_image: string;

  @Column({ name: 'follower_count', default: 0 })
  followerCount: number;

  @Column({ name: 'following_count', default: 0 })
  followingCount: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @OneToMany((type) => Post, (posts) => posts.user)
  @JoinColumn()
  posts: Post[];

  @OneToMany((type) => PostLike, (postLikes) => postLikes.user)
  @JoinColumn()
  postLikes: PostLike[];

  @OneToMany((type) => PostUserTag, (postUserTags) => postUserTags.user)
  @JoinColumn()
  postUserTags: PostUserTag[];

  @OneToMany((type) => Comment, (comments) => comments.user)
  @JoinColumn()
  comments: Comment[];

  @OneToMany((type) => CommentLike, (commentLikes) => commentLikes.user)
  @JoinColumn()
  commentLikes: CommentLike[];

  @OneToMany((type) => CommentLike, (commentUserTags) => commentUserTags.user)
  @JoinColumn()
  commentUserTags: CommentUserTag[];

  @OneToMany((type) => User, (user) => user.collections)
  @JoinColumn()
  collections: Collection[];
}

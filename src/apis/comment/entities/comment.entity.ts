import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CommentLike } from './comment-like.entity';
import { CommentUserTag } from './comment-usertag.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

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

  //TODO: 이부분 프리티어로 어떻게 해결할까?
}

/*
ManyToOne 관계에서는 이렇게 써줘야 하는것인가? 
ser_id를 통해서 nickname과 user_profile을 불러올 수 있을까? 
*/

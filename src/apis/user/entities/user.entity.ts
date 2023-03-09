import { Bookmark } from 'src/apis/bookmark/entities/bookmark.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { PostLike } from 'src/apis/post/entities/post-like.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { PostUserTag } from 'src/apis/post/entities/post-usertag.entity';
import { CommentLike } from 'src/apis/comment/entities/comment-like.entity';
import { CommentUserTag } from 'src/apis/comment/entities/comment-usertag.entity';
import { IsEnum } from 'class-validator';
import { MyList } from 'src/apis/my-list/entities/my-list.entity';
import { BookmarkCollection } from 'src/apis/bookmark-collection/entities/bookmark-collection.entity';
import { Follow } from './follow.entity';

/*TODO:
@Unique(['nickname']) 과   @Column({ unique: true }) 둘의 차이점이 뭘까?
*/

@Entity()
@Unique(['nickname'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  phone_number: string;

  @Column()
  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  @Column()
  birth: Date;

  //TODO: 회원가입시 default 값으로 가입완료
  @Column()
  profile_image: string;

  @Column()
  introduce: string;

  @OneToMany((type) => MyList, (my_lists) => my_lists.user)
  @JoinColumn()
  my_lists: MyList[];

  @OneToMany((type) => Bookmark, (bookmarks) => bookmarks.user)
  @JoinColumn()
  bookmarks: Bookmark[];

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

  @OneToMany((type) => User, (user) => user.bookmark_collections)
  @JoinColumn()
  bookmark_collections: BookmarkCollection[];

  @Column({ name: 'follower_count', default: 0 })
  followerCount: number;

  @Column({ name: 'following_count', default: 0 })
  followingCount: number;

  //TODO : 팔로잉 팔로워 수정필요
  // @ManyToMany(type => User, user => user.followings)
  // @JoinTable({
  //   name: 'follow',
  //   joinColumn: {
  //     name: 'followingId',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'followerId',
  //     referencedColumnName: 'id',
  //   },
  // })
  // followers: User[];

  // @ManyToMany(type => User, user => user.followers)
  // followings: User[];
}
import { Bookmark } from 'src/apis/bookmark-collection/entities/bookmark.entity';
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
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { PostUserTag } from 'src/apis/post/entities/post-usertag.entity';
import { CommentLike } from 'src/apis/comment/entities/comment-like.entity';
import { CommentUserTag } from 'src/apis/comment/entities/comment-usertag.entity';
import { IsEnum } from 'class-validator';
import { MyList } from 'src/apis/my-list/entities/my-list.entity';
import { BookmarkCollection } from 'src/apis/bookmark-collection/entities/bookmark-collection.entity';

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
  introduce: String;

  //TODO: 회원가입시 default 이미지로값으로 가입완료
  @Column({ nullable: true, default: 'default-image-url' })
  profile_image: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

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

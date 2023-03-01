import { Bookmark } from 'src/apis/bookmark/entities/bookmark.entity';
import { Collection } from 'src/apis/collection/entities/collection.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { PostLike } from 'src/apis/post/entities/postLike.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, ManyToMany, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { PostUserTag } from 'src/apis/post/entities/postUserTag.entity';
import { CommentLike } from 'src/apis/comment/entities/commentLike.entity';
import { CommentUserTag } from 'src/apis/comment/entities/commentUserTag.entity';
import { IsEnum } from 'class-validator';

/*TODO:
@Unique(['nickname']) 과   @Column({ unique: true }) 둘의 차이점이 뭘까?

*/

@Entity()
@Unique(['nickname'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
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

  @Column()
  profile_image: string;
  
  @OneToMany(type => Collection, collections => collections.user)
  @JoinColumn()
  collections: Collection[];

  @OneToMany(type => Bookmark, bookmarks => bookmarks.user)
  @JoinColumn()
  bookmarks: Bookmark[];

  @OneToMany(type => Post, posts => posts.user)
  @JoinColumn()
  posts: Post[];

  @OneToMany(type => PostLike, postLikes => postLikes.user)
  @JoinColumn()
  postLikes: PostLike[];

  @OneToMany(type => PostUserTag, postUserTags => postUserTags.user)
  @JoinColumn()
  postUserTags: PostUserTag[];

  @OneToMany(type => Comment, comments => comments.user)
  @JoinColumn()
  comments: Comment[];

  @OneToMany(type => CommentLike, commentLikes => commentLikes.user)
  @JoinColumn()
  commentLikes: CommentLike[];

  @OneToMany(type => CommentLike, commentUserTags => commentUserTags.user)
  @JoinColumn()
  commentUserTags: CommentUserTag[];





  //TODO : 팔로잉 팔로워 수정필요 , 프리티어 설정 수정필요


  @Column({ name: 'followers_count', default: 0 })
  followers_count: number;

  @Column({ name: ' followings_count:', default: 0 })
  followings_count: number;




  @ManyToMany(type => User)
  @JoinTable({
    name: 'follow',
    joinColumn: { name: 'followingId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followerId', referencedColumnName: 'id' },
  })
  followings: User[];

  @ManyToMany(type => User, user => user.followings)
  followers: User[];
}
function Enum(arg0: string[]) {
  throw new Error('Function not implemented.');
}


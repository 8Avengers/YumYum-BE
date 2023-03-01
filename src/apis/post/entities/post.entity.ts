import { Bookmark } from 'src/apis/bookmark/entities/bookmark.entity';
import { Collection } from 'src/apis/collection/entities/collection.entity';
import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { Image } from './image.entity';
import { PostLike } from './postLike.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { PostUserTag } from './postUserTag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  rating: number;

  @Column()
  img_url: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(type => Restaurant, restaurant => restaurant.posts)
  @JoinColumn()
  restaurant: Restaurant;

  @ManyToMany(type => Bookmark, bookmarks => bookmarks.posts)
  @JoinTable()
  bookmarks: Bookmark[];

  @OneToMany(type => Image, images => images.post)
  @JoinColumn()
  images: Image[];

  @OneToMany(type => PostLike, postLIkes => postLIkes.post)
  @JoinColumn()
  postLikes: PostLike[];

  @OneToMany(type => Comment, comments => comments.post)
  @JoinColumn()
  comments: Comment[];

  @ManyToOne(type => User, user => user.posts)
  @JoinColumn()
  user: User;

  @ManyToMany(type => Hashtag, hashtags => hashtags.posts)
  @JoinTable()
  hashtags: Hashtag[];

  @ManyToMany(type => Collection, collections => collections.posts)
  @JoinTable()
  collections: Collection[];


  @OneToMany(type => PostUserTag, postUserTags => postUserTags.post)
  @JoinColumn()
postUserTags: PostUserTag[];


//TODO : 프리티어 자동줄맞춤 설정 어떻게 하는 것일까?
//TODO : 프리티어 줄 설정을 어떻게 해줘야 하는 것일까? 
}

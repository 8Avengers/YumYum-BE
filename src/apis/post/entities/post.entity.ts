import { Bookmark } from 'src/apis/bookmark/entities/bookmark.entity';
import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { Image } from './image.entity';
import { PostLike } from './post-like.entity';
import { Comment } from 'src/apis/comment/entities/comment.entity';
import { PostUserTag } from './post-usertag.entity';
import { MyList } from 'src/apis/my-list/entities/my-list.entity';

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

  @Column({
    type: 'enum',
    enum: ['public', 'private'],
    default: 'public'
  })
  visibility: 'public' | 'private';

  @ManyToOne(type => Restaurant, restaurant => restaurant.posts)
  @JoinColumn()
  restaurant: Restaurant;

  @OneToMany(type => Bookmark, bookmark => bookmark.post)

  bookmarks: Bookmark[];

  @OneToMany((type) => Image, (images) => images.post)
  @JoinColumn()
  images: Image[];

  @OneToMany((type) => PostLike, (postLIkes) => postLIkes.post)
  @JoinColumn()
  postLikes: PostLike[];

  @OneToMany((type) => Comment, (comments) => comments.post)
  @JoinColumn()
  comments: Comment[];

  @ManyToOne((type) => User, (user) => user.posts)
  @JoinColumn()
  user: User;

  @ManyToMany((type) => Hashtag, (hashtags) => hashtags.posts)
  @JoinTable()
  hashtags: Hashtag[];

  @ManyToMany((type) => MyList, (my_lists) => my_lists.posts)
  @JoinTable()
  my_lists: MyList[];

  @OneToMany((type) => PostUserTag, (postUserTags) => postUserTags.post)
  @JoinColumn()
  postUserTags: PostUserTag[];



//TODO : 프리티어 자동줄맞춤 설정 어떻게 하는 것일까?
}


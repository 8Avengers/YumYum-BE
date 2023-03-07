import { BookmarkCollection } from '../../bookmark-collection/entities/bookmark-collection.entity';
import { Post } from '../../post/entities/post.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.bookmarks)
  @JoinColumn()
  restaurant: Restaurant;

  @ManyToOne((type) => Post, (post) => post.bookmarks)
  @JoinColumn()
  post: Post;

  @ManyToOne((type) => User, (user) => user.bookmarks)
  user: User;

  @ManyToMany(
    (type) => BookmarkCollection,
    (bookmark_collections) => bookmark_collections.bookmarks,
  )
  @JoinTable()
  bookmark_collections: BookmarkCollection[];
  //TODO: 다대다 관계에서는 @JoinTable()은 한쪽만 써야합니다.
}

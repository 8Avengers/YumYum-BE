import { Post } from 'src/apis/post/entities/post.entity';
import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from './collection.entity';

@Entity()
export class CollectionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Collection, (collection) => collection.collectionItems)
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;

  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.collectionItems)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne((type) => Post, (post) => post.collectionItems)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}

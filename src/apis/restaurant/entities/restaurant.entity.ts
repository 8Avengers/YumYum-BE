import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { CollectionItem } from '../../collection/entities/collection-item.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category_name: string;

  @Column()
  category_group_name: string;

  @Column()
  phone_number: string;

  @Column()
  img_url: string;

  @Column()
  kakao_place_id: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column()
  number_address: string;

  @Column()
  road_address: string;

  //TODO: 베이스엔티티로 바꾸기
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @OneToMany((type) => Post, (posts) => posts.restaurant)
  @JoinColumn()
  posts: Post[];

  @OneToMany(
    (type) => CollectionItem,
    (collectionItem) => collectionItem.restaurant,
  )
  collectionItems: CollectionItem[];
}

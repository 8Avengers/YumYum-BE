import { User } from 'src/apis/user/entities/user.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { CollectionItem } from './collection-item.entity';

@Entity({ name: 'collection' })
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @Column({
    type: 'enum',
    enum: ['public', 'private'],
    default: 'public',
  })
  visibility: 'public' | 'private';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(
    (type) => CollectionItem,
    (collectionItem) => collectionItem.collection,
  )
  collectionItems: CollectionItem[];

  @ManyToOne((type) => User, (user) => user.collections)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Bookmark } from '../../bookmark/entities/bookmark.entity';

@Entity({ name: 'bookmark_collection' })
export class BookmarkCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne((type) => User, (user) => user.bookmark_collections)
  @JoinColumn()
  user: User;

  @ManyToMany((type) => Bookmark, (bookmarks) => bookmarks.bookmark_collections)
  bookmarks: Bookmark[];
  //TODO: 다대다 관계에서는 @JoinTable()은 한쪽만 써야합니다.
}

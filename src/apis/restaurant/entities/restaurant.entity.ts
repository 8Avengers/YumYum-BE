import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Double, OneToMany, JoinTable, ManyToMany, JoinColumn } from 'typeorm';
import { Post } from 'src/apis/post/entities/post.entity';
import { Bookmark } from 'src/apis/bookmark/entities/bookmark.entity';

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

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;


  @OneToMany(type => Post, posts => posts.restaurant)
  @JoinColumn()
  posts: Post[];

  @ManyToMany(type => Bookmark, bookmarks => bookmarks.restaurants )
  @JoinTable()
  bookMarks: Bookmark[];


}

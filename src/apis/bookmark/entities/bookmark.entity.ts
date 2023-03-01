import { Post } from 'src/apis/post/entities/post.entity';
import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToMany(type => Restaurant, restaurants => restaurants.bookMarks)
  @JoinTable()
  restaurants: Restaurant[];

  @ManyToMany(type => Post, post => post.bookmarks)
  @JoinTable()
  posts: Post[];

  @ManyToOne(type => User, user => user.bookmarks)
  user: User;



}



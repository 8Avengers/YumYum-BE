import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @ManyToOne(type => Post, post => post.images)
  @JoinColumn() 
  post: Post;
}
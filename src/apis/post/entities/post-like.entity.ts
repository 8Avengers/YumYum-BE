import { User } from 'src/apis/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Post } from './post.entity';

@Entity()
export class PostLike {
@PrimaryGeneratedColumn()
id: number;

@ManyToOne(type => User, user => user.postLikes)
@JoinColumn()
user: User;

@ManyToOne(type => Post, post => post.postLikes)
@JoinColumn()
post: Post;
}
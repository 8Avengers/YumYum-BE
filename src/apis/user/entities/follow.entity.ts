// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// import { User } from './user.entity';

// @Entity()
// export class Follow {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(type => User, user => user.followings)
//   following: User;

//   @ManyToOne(type => User, user => user.followers)
//   follower: User;
// }

import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Unique('following_pair', ['follower', 'following'])
@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'follower_id' })
  @ManyToOne(() => User)
  follower: User;

  @JoinColumn({ name: 'following_id' })
  @ManyToOne(() => User)
  following: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}

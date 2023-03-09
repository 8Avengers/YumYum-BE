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

import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

// there can be only 1 row of same follower+followee
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
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}

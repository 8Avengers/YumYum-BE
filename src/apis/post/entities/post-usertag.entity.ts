import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from './post.entity';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

@Entity()
export class PostUserTag {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  //   @Column()
  //   user_id: number;

  //   @Column()
  //   post_id: number;

  @ManyToOne((type) => User, (user) => user.postUserTags)
  @JoinColumn()
  user: User;

  @ManyToOne((type) => Post, (post) => post.postUserTags)
  @JoinColumn()
  post: Post;
}

/*TODO1: 이부분 안써주는 것이 맞을까? 


@ManyToOne(type => User, user => user.postUserTags)
@JoinColumn()
user: User;

관계를 정의해줌으로써  외래키 설정이 끝나는 것이 아닌가? 
아래 코드처럼 외래키를 컬럼으로 반드시 만들어줘야 하는걸까요?
이렇게 외래키를 컬럼으로 써줘야 하는 것인가?


TODO2: 관계설정 질문하기. 
*/

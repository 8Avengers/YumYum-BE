import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Reports {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (reporter) => reporter.reports)
  reporter: User;
  @Column()
  reporterId: number;

  // 다대다 테이블? 릴레이션 테이블? 아니면 3개 노가다?
  @Column()
  reportedId: number;

  // @ManyToOne(() => Post)
  // reportedPost: Post;
  // @Column()
  // reportedPostId: number;

  // @ManyToOne(() => Comment)
  // reportedComment: Comment;
  // @Column()
  // reportedCommentId: number;

  // @ManyToOne(() => User)
  // reportedUser: User;
  // @Column()
  // reportedUserId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ['checking', 'rejected', 'completed'],
    default: 'checking',
  })
  status: 'checking' | 'rejected' | 'completed';

  @Column({ type: 'enum', enum: ['user', 'post', 'comment'] })
  type: 'user' | 'post' | 'comment';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

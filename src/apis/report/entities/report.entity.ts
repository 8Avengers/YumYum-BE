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
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reportedId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'reportedId', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'reportedId', referencedColumnName: 'id' })
  comment: Comment;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ['checking', 'rejected', 'completed'],
    default: 'checking',
  })
  status: 'checking' | 'rejected' | 'completed';

  // @Column({ type: 'varchar' })
  // type: string;

  // @Column({ type: 'json' })
  // type: any;

  @Column({ type: 'enum', enum: ['user', 'post', 'comment'] })
  type: 'user' | 'post' | 'comment';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

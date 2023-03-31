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

  // @Column()
  // reportedId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: Post;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'commentId', referencedColumnName: 'id' })
  comment: Comment;

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

  // @Column({ type: 'json', default: 'checking' })
  // status: any;

  // @Column({ type: 'json' })
  // type: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

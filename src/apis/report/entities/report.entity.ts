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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userId: User;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  postId: Post;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'comment_id', referencedColumnName: 'id' })
  commentId: Comment;

  @Column()
  description: string;

  @Column({ type: 'varchar', default: 'checking' })
  status: string;

  @Column({ type: 'varchar' })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

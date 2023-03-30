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

  // @ManyToOne(() => User, (reporter) => reporter.reports)
  // reporter: User;
  @Column()
  reporterId: number;

  @Column()
  reported: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  status: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn({ default: null })
  updateAt?: Date;

  @DeleteDateColumn({ default: null })
  deleteAt?: Date;
}

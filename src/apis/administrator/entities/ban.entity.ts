import { User } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Ban {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', name: 'ban_duration' })
  banDuration: Date;

  @Column({ type: 'varchar', name: 'ban_description' })
  banDescription: string;

  @ManyToOne(() => User)
  @Column({ name: 'user_id' })
  userId: number;
}

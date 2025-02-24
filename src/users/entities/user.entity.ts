import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', unique: true, nullable: false })
  name: string;

  @Column({ name: 'phone_number', nullable: true })
  phone_number: string;

  @Column({ name: 'score', default: 0 })
  score: number;

  @CreateDateColumn()
  created_at: Date;
}

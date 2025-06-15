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

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({
    type: 'mediumtext',  // 또는 'longtext'
    name: 'profile_image',
    nullable: true
  })
  profile_image: string;

  @Column({ name: 'score', default: 0 })
  score: number;

  @Column({ nullable: true })
  type: string;

  @CreateDateColumn()
  created_at: Date;
}

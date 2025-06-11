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
    name: 'profile_image',
    nullable: false,
    default: '../public/images/profile_img.png',
  })
  profile_image: string;

  @Column({ name: 'score', default: 0 })
  score: number;

  @Column({ nullable: true })
  type: string;

  @CreateDateColumn()
  created_at: Date;
}

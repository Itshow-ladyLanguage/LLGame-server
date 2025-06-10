import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'quiz' })
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'question' })
  question: string;

  @Column({ name: 'answer' })
  answer: string;

  @Column({ name: 'score' })
  score: string;
}

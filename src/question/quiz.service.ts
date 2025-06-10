import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async findAllQuizzes(): Promise<Quiz[]> {
    return await this.quizRepository.find();
  }

  // 배열 랜덤 섞기
  shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  async findRandomQuizzes(): Promise<Object> {
    const quizzes = await this.findAllQuizzes();

    const multipleChoiceAll = quizzes.filter(
      (q) => q.type === 'multiple-choice',
    );
    const shortAnswerAll = quizzes.filter((q) => q.type === 'short-answer');
    const oxQuizAll = quizzes.filter((q) => q.type === 'ox');

    const multipleChoice = this.shuffleArray([...multipleChoiceAll])
      .slice(0, 6)
      .map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        answer: JSON.parse(q.answer),
        score: JSON.parse(q.score),
      }));

    const shortAnswer = this.shuffleArray([...shortAnswerAll])
      .slice(0, 3)
      .map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        score: JSON.parse(q.score),
      }));

    const oxQuiz = this.shuffleArray([...oxQuizAll])
      .slice(0, 3)
      .map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        answer: q.answer,
        score: JSON.parse(q.score),
      }));

    return { multipleChoice, shortAnswer, oxQuiz };
  }
}

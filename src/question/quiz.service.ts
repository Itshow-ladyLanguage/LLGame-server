import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';

// DTO 타입들 export 처리
export interface MultipleChoiceDto {
  id: number;
  type: string;
  question: string;
  answer: any;
  score: any;
}

export interface ShortAnswerDto {
  id: number;
  type: string;
  question: string;
  score: any;
}

export interface OxQuizDto {
  id: number;
  type: string;
  question: string;
  answer: string;
  score: any;
}

@Injectable()
export class QuizService {
  private usedQuizIds = new Set<number>(); // 출제된 문제 ID 저장

  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,
  ) {}

  async findAllQuizzes(): Promise<Quiz[]> {
    return await this.quizRepository.find();
  }

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

  private filterUsed(quizzes: Quiz[]): Quiz[] {
    return quizzes.filter(q => !this.usedQuizIds.has(q.id));
  }

  private markUsed(quizzes: Quiz[]) {
    quizzes.forEach(q => this.usedQuizIds.add(q.id));
  }

  async findRandomMultipleChoice(): Promise<MultipleChoiceDto[]> {
    const quizzes = await this.findAllQuizzes();
    const multipleChoiceAll = this.filterUsed(
      quizzes.filter(q => q.type === 'multiple-choice'),
    );

    if (multipleChoiceAll.length === 0) {
      throw new NotFoundException('No unused multiple choice quizzes left');
    }

    const selected = this.shuffleArray(multipleChoiceAll).slice(0, 6);
    this.markUsed(selected);

    return selected.map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      answer: JSON.parse(q.answer),
      score: JSON.parse(q.score),
    }));
  }

  async findRandomShortAnswer(): Promise<ShortAnswerDto[]> {
    const quizzes = await this.findAllQuizzes();
    const shortAnswerAll = this.filterUsed(
      quizzes.filter(q => q.type === 'short-answer'),
    );

    if (shortAnswerAll.length === 0) {
      throw new NotFoundException('No unused short answer quizzes left');
    }

    const selected = this.shuffleArray(shortAnswerAll).slice(0, 3);
    this.markUsed(selected);

    return selected.map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      score: JSON.parse(q.score),
    }));
  }

  async findRandomOX(): Promise<OxQuizDto[]> {
    const quizzes = await this.findAllQuizzes();
    const oxQuizAll = this.filterUsed(quizzes.filter(q => q.type === 'ox'));

    if (oxQuizAll.length === 0) {
      throw new NotFoundException('No unused ox quizzes left');
    }

    const selected = this.shuffleArray(oxQuizAll).slice(0, 3);
    this.markUsed(selected);

    return selected.map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      answer: q.answer,
      score: JSON.parse(q.score),
    }));
  }

  async findRandomQuizzes(): Promise<{
    multipleChoice: MultipleChoiceDto[];
    shortAnswer: ShortAnswerDto[];
    oxQuiz: OxQuizDto[];
  }> {
    const quizzes = await this.findAllQuizzes();

    const multipleChoiceAll = this.filterUsed(
      quizzes.filter(q => q.type === 'multiple-choice'),
    );
    const shortAnswerAll = this.filterUsed(
      quizzes.filter(q => q.type === 'short-answer'),
    );
    const oxQuizAll = this.filterUsed(quizzes.filter(q => q.type === 'ox'));

    if (
      multipleChoiceAll.length === 0 &&
      shortAnswerAll.length === 0 &&
      oxQuizAll.length === 0
    ) {
      throw new NotFoundException('No unused quizzes left');
    }

    const multipleChoiceSelected = this.shuffleArray(multipleChoiceAll).slice(
      0,
      6,
    );
    const shortAnswerSelected = this.shuffleArray(shortAnswerAll).slice(0, 3);
    const oxQuizSelected = this.shuffleArray(oxQuizAll).slice(0, 3);

    this.markUsed([
      ...multipleChoiceSelected,
      ...shortAnswerSelected,
      ...oxQuizSelected,
    ]);

    return {
      multipleChoice: multipleChoiceSelected.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        answer: JSON.parse(q.answer),
        score: JSON.parse(q.score),
      })),
      shortAnswer: shortAnswerSelected.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        score: JSON.parse(q.score),
      })),
      oxQuiz: oxQuizSelected.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        answer: q.answer,
        score: JSON.parse(q.score),
      })),
    };
  }

  async findShortAnswer(): Promise<Quiz[]> {
    const quizzes = await this.findAllQuizzes();
    return quizzes.filter(q => q.type === 'short-answer');
  }
}

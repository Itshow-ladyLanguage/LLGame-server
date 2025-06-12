import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenAI } from 'openai'; 
import * as dotenv from 'dotenv';
import { QuizService } from '../question/quiz.service';
import { AnswerDto } from './dto/answer.dto';

dotenv.config();

@Injectable()
export class GradingService {
  private openai: OpenAI;

  constructor(private readonly quizService: QuizService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async evaluateAnswer(
    quiz_id: string,
    dto: AnswerDto,
  ): Promise<{ score: number; feedback: string }> {
    const quizzes = await this.quizService.findAllQuizzes();
    console.log('퀴즈 목록:', quizzes);
    console.log('quiz_id:', quiz_id);

    const id = parseInt(quiz_id as any, 10);
    const quiz = quizzes.find(q => q.id === id);

    if (!quiz) {
      return {
        score: 0,
        feedback: '문제를 찾을 수 없습니다.',
      };
    }

    const prompt = this.buildPromptFromQuiz(quiz.question, dto.answer);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '당신은 여자친구의 감정을 이해하는 AI 채점관입니다. 답변을 0, 15, 30, 45, 60점으로 평가하세요.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const content = completion.choices[0].message?.content ?? '';
    const scoreMatch = content.match(/(\d{1,3})점/);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

    return {
      score,
      feedback: content,
    };
  }

  private buildPromptFromQuiz(questionTemplate: string, userAnswer: string): string {
    return questionTemplate.replace(/\$\{userAnswer\}/g, userAnswer);
  }

  async getQuizInfo(quiz_id: number) {
    const quizzes = await this.quizService.findRandomQuizzes();

    console.log(quizzes);
    // console.log(quiz);
    if (!quizzes) {
      throw new NotFoundException('해당 퀴즈를 찾을 수 없습니다.');
    }

    return quizzes;
  }
}

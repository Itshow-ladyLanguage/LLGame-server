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
    const id = parseInt(quiz_id as any, 10);
    const quiz = quizzes.find((q) => q.id === id);

    if (!quiz) {
      return {
        score: 0,
        feedback: '❌ 문제를 찾을 수 없습니다.',
      };
    }

    const prompt = this.buildPromptFromQuiz(quiz.question, dto.answer);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
        role: 'system',
        content: `
        당신은 사용자 답변에 감정적으로 반응하고 점수를 평가하는 AI입니다.
        DB에 있는 답과 비교해서 비슷할수록 높은 점수를 주고 또는, 문제에 답을 잘했을수록 높은 점수를 주세요.

        아래의 형식을 반드시 지키세요.  
        ⚠️ 이 형식을 따르지 않으면 평가 실패로 간주됩니다.

        응답 형식:

        1. 첫 번째 줄: 사용자의 답변에 대한 감정적 피드백 (1~2문장)
        2. 두 번째 줄: "점수: XX점" ← 반드시 이 형식으로, 점수는 0, 15, 30, 45, 60 중 하나

        예시:
        "당신의 답변은 진심이 느껴지고 상대를 배려하는 모습이 보입니다.  
        점수: 45점"

        무조건 이 형식을 지키세요. 다른 형식으로 답하지 마세요.
        `,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0].message?.content ?? '';
    console.log('💬 GPT 응답:', content);

    // 점수 추출 정규식 개선
    const scoreMatch = content.match(/(?:점수[:：]?\s*)?(\d{1,3})\s*점/);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

    if (!scoreMatch) {
      console.warn('⚠️ 점수 추출 실패, 기본 0점 반환');
    }

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

    if (!quizzes) {
      throw new NotFoundException('❌ 해당 퀴즈를 찾을 수 없습니다.');
    }

    return quizzes;
  }
}

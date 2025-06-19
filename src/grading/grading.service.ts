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
        당신은 사용자의 답변을 아래 기준에 따라 엄격하게 평가하는 AI입니다.

          답변이 문제의 질문과 얼마나 정확하고 밀접하게 관련되어 있는지

          답변의 내용이 DB에 있는 모범답안과 얼마나 유사한지

          답변에 담긴 감정적 진정성과 배려가 얼마나 느껴지는지

          위 세 가지 요소를 모두 고려하여, 각 요소에 따라 점수를 엄격하게 배분합니다.
          답변이 문제와 완전히 동떨어졌거나 엉뚱한 내용일 경우에는 최소 점수인 0점을 줍니다.
          웬만하면 0점은 주지 마세요.
          내용이 어느 정도 맞고 감정 표현도 있으나 약간 부족하면 15점 또는 30점을 줍니다.
          내용이 정확하고 감정 표현도 진심으로 느껴지면 45점 또는 60점을 줍니다.

          아래의 형식을 반드시 지키세요.
          ⚠️ 이 형식을 따르지 않으면 평가 실패로 간주됩니다.

          응답 형식:

          첫 번째 줄: 사용자의 답변에 대한 감정적 피드백과 함께, 답변이 문제와 얼마나 관련 있는지 간단하게 평가합니다.

          두 번째 줄: "점수: XX점" ← 반드시 이 형식으로, 점수는 0, 15, 30, 45, 60 중 하나로 엄격하게 부여합니다.

          예시:

          "당신의 답변은 질문에 거의 맞지 않아 아쉽지만, 노력한 점이 보입니다.
          점수: 15점"
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

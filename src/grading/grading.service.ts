// src/grading/grading.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { QuestionService } from './question.service';

dotenv.config();

@Injectable()
export class GradingService {
  private openai: OpenAI;

  constructor(private readonly questionService: QuestionService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async evaluateAnswer(
    questionId: string,
    userAnswer: string,
  ): Promise<{ score: number; feedback: string }> {
    let promptTemplate = await this.questionService.getPromptById(questionId);

    const prompt = promptTemplate
      ? promptTemplate.replace('${userAnswer}', userAnswer)
      : `문제 프롬프트를 찾을 수 없습니다. 사용자 답변: ${userAnswer}`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            '당신은 여자친구의 감정을 이해하는 AI 채점관입니다. 답변을 0, 15, 30, 45, 60점으로 평가하세요',
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
}

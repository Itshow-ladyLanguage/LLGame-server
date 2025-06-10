import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GradingService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async evaluateAnswer(
    questionId: string,
    userAnswer: string,
  ): Promise<{ score: number; feedback: string }> {
    const prompt = this.buildPrompt(questionId, userAnswer);

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

  private buildPrompt(questionId: string, userAnswer: string): string {
    const questionPromptMap: Record<string, string> = {
      q1: `
문제:
여친: “오빠 사진 잘나오고 있어?”
모범 답변:
- 어 지금 너무 이뻐
- 와 진짜 세상에서 제일 아름다워
- 사진의 실물이 안담겨
- 자기야 사진 찍는 사람 중에 지금 자기가 탑티어야
점수 기준:
- 아주 이상적인 답변: 60점
- 괜찮은 칭찬: 45점
- 그냥 예의 차림: 30점
- 진심이 안 느껴짐: 15점
- 태도 나쁨, 성의 없음: 0점
사용자 답변: "${userAnswer}"
형식: "점수: XX점"
      `,
      q2: `
문제:
여친: “오빠 뭐해~?”라고 물어보는 이유를 여자의 속마음으로 답하시오.
모범 답변:
- 아이씨 폰 왜 보냐 난 폰 없는 줄 알아?
- 폰 보라고 내가 화장한 줄 아냐?
- 둘이 얼마나 같이 있는다고 넌 폰을 쳐하냐
점수 기준:
- 속마음을 완전히 간파: 60점
- 핵심만 파악: 45점
- 애매하게 맞춤: 30점
- 전혀 공감 못함: 15점
- 전혀 관련 없음: 0점
사용자 답변: "${userAnswer}"
      `,
      q3: `
문제:
여친: “오빠 배고프지 않아?”에 숨겨진 속마음은?
모범 답변:
- 배고픈데 왜 밥을 안맥여?
- 먹고싶은 음식 있어서
- 배고픈데 말하기 부끄러워서
- 빨리 나 밥 먹여라
점수 기준:
- 완벽한 내면 이해: 60점
- 꽤 정확함: 45점
- 평범하게 이해함: 30점
- 틀에 박힌 대답: 15점
- 완전 오해: 0점
사용자 답변: "${userAnswer}"
      `,
      q4: `
문제:
여친: “오늘 나 화장이 맘에 안들어 오빠는 어때?”에 대한 최고의 답변은?
모범 답변:
- 왜? 오늘이 제일 이쁜 것 같은데
- 그래도 이쁜데
점수 기준:
- 진심+칭찬+자존감 회복 도움: 60점
- 괜찮은 위로: 45점
- 그냥 그럭저럭: 30점
- 무성의함: 15점
- 민감한 걸 무시하거나 부정: 0점
사용자 답변: "${userAnswer}"
      `,
      q5: `
문제:
(상황) 여친: 오빠 일어났어? → 남친: 응 아까 일어나서 밥 먹었어 → 여친: ……….. → 남친: 응? 왜?
Q: 여자가 화난 이유는?
정답: 일어나고 밥도 먹었는데 연락 안 해서
점수 기준:
- 핵심 정확히 파악: 60점
- 맥락 맞게 추측: 45점
- 모호한 추론: 30점
- 억측, 논점 흐림: 15점
- 완전 틀림: 0점
사용자 답변: "${userAnswer}"
      `,
      q6: `
문제:
(상황) 당신과 여친이 싸우고 있습니다. “됐어. 나 갈게.”라고 말하면?
Q: 어떤 말을 해야 하는지 서술하시오
모범 답변:
- 미안해. 가지 마. 우리 이야기 좀 더 하자.
- 너 마음 알아. 내가 잘못했어.
점수 기준:
- 진정성 있고 공감: 60점
- 사과와 소통 시도: 45점
- 상황 파악만 함: 30점
- 무대응/역반응: 15점
- 더 상처 주는 말: 0점
사용자 답변: "${userAnswer}"
      `,
      q7: `
문제:
여친: “요즘 내 외모가 비수기야..”
모범 답변:
- 무슨 소리야~ 넌 항상 성수기지~
점수 기준:
- 위트+칭찬 완벽: 60점
- 적절한 위로: 45점
- 그냥 예의: 30점
- 감정 무시: 15점
- 공감 없음/무시: 0점
사용자 답변: "${userAnswer}"
      `,
      q8: `
문제:
(상황) 일주일 만에 데이트 후, 밤 9시에 헤어지고 1시간 뒤 여친에게 "잘 들어갔어?"라고 카톡을 보냄. 여친은 화가 나서 답장하지 않음. 왜?
정답: 지금까지 연락 안 하고 있다가 이제야 연락함. 서운함.
점수 기준:
- 서운함의 본질 파악: 60점
- 상황 인식: 45점
- 애매한 반응: 30점
- 논점 흐림: 15점
- 전혀 관련 없음: 0점
사용자 답변: "${userAnswer}"
      `,
    };

    return questionPromptMap[questionId] ?? `문제 프롬프트를 찾을 수 없습니다. 사용자 답변: ${userAnswer}`;
  }
}

import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { GradingService } from './grading.service';
import { AnswerDto } from './dto/answer.dto';

@Controller('grading')
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  @Post(':quiz_id')
  async evaluateAnswer(
    @Param('quiz_id') quiz_id: string,
    @Body() dto: AnswerDto,
  ): Promise<{ score: number; feedback: string }> {
    return this.gradingService.evaluateAnswer(quiz_id, dto);
  }
  
  @Get(':quiz_id')
  async getQuiz(@Param('quiz_id') quiz_id: number) {
    return this.gradingService.getQuizInfo(quiz_id);
  }
}

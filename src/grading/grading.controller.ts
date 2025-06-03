import { Controller, Post, Body } from '@nestjs/common';
import { GradingService } from './grading.service';

@Controller('grading')
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  @Post('score')
  async scoreAnswer(@Body() body: { questionId: string; userAnswer: string }) {
    return this.gradingService.evaluateAnswer(body.questionId, body.userAnswer);
  }
}

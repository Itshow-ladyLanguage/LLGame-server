import { Controller, Get } from '@nestjs/common';
import { QuestionService } from './quiz.service';

@Controller('api/quiz')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async findAllQuestion() {
    return this.questionService.findAllQuizzes();
  }

  @Get('random-set')
  async findRandomQuizzes() {
    return this.questionService.findRandomQuizzes();
  }
}

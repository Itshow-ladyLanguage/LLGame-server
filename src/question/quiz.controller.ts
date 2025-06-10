import { Controller, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('api/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async findAllQuestion() {
    return this.quizService.findAllQuizzes();
  }

  @Get('random-set')
  async findRandomQuizzes() {
    return this.quizService.findRandomQuizzes();
  }
}

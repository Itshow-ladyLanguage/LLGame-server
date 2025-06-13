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

  @Get('multiple')
  async findRandomMultipleChoice() {
    return this.quizService.findRandomMultipleChoice();
  }

  @Get('short')
  async findRandomShortAnswer() {
    return this.quizService.findRandomShortAnswer();
  }

  @Get('ox')
  async findRandomOX() {
    return this.quizService.findRandomOX();
  }
}

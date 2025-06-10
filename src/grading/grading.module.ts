import { Module } from '@nestjs/common';
import { GradingController } from './grading.controller';
import { GradingService } from './grading.service';
import { QuizModule } from 'src/question/quiz.module';

@Module({
  controllers: [GradingController, QuizModule],
  providers: [GradingService],
})
export class GradingModule {}

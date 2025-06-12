import { Module } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';
import { QuizModule } from '../question/quiz.module';

@Module({
  imports: [QuizModule],
  controllers: [GradingController],
  providers: [GradingService],
})
export class GradingModule {}

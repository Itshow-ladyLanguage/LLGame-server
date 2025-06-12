import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionService } from './question/question.service';
import { GradingService } from './grading/grading.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionService, GradingService],
  exports: [QuestionService, GradingService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { QuestionService } from './quiz.service';
import { QuestionController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './ormconfig';
import { QuizModule } from './question/quiz.module';
import { GradingModule } from './grading/grading.module';
import { MailModule } from './mail/email.module';  

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    QuizModule,
    GradingModule,
    MailModule,  // 추가
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

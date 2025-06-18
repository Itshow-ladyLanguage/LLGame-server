import { Module } from '@nestjs/common';
import { MailController } from './email.controller';
import { MailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}

import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MailService } from '../mail/email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('api/send-email')
export class MailController {  
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendEmail(@Body() body: SendEmailDto) {
    const { email, image } = body;
    if (!email || !image) {
      throw new HttpException('email과 image를 모두 보내주세요.', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.mailService.sendCaptureEmail(email, image);
      return { message: `이메일이 ${email} 로 성공적으로 발송되었습니다.` };
    } catch (error) {
      throw new HttpException(
        `이메일 전송 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

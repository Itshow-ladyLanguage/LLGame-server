import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_NAME'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendCaptureEmail(toEmail: string, base64Image: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"여자어 게임" <${this.configService.get<string>('EMAIL_NAME')}>`,
      to: toEmail,
      subject: '[여자어 게임] 사진 도착!',
      text:
        'IT Show에 오셔서 저희 부스를 이용해주셔서 감사합니다.\n' +
        '사용자님의 게임 결과를 전송드립니다.\n' +
        'https://season-kumquat-2bf.notion.site/2105d48446a4800685a3f48027aa7d07?source=copy_link',
      attachments: [
        {
          filename: 'capture.jpg',
          content: base64Image.split('base64,')[1], 
          encoding: 'base64',
        },
      ],
    });
  }
}

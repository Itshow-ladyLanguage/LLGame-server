import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET, POST, DELETE, PUT, PATCH, HEAD',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new (class {
    catch(exception: any, host: any) {
      console.error('=== 글로벌 에러 캐치 ===');
      console.error('에러:', exception);
      console.error('스택:', exception.stack);
      
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      
      response.status(500).json({
        message: 'Internal server error',
        error: exception.message,
        statusCode: 500
      });
    }
  })());
  
  await app.listen(process.env.PORT);
}
bootstrap();

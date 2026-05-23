import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ADD THIS LINE:
  app.enableCors({
    origin: 'http://localhost:5173', // Your React App URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log('🚀 Backend running on http://localhost:3000');
}
bootstrap();
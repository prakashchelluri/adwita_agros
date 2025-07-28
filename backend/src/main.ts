import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  });
  console.log(`CORS configured for origin: ${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
  app.useGlobalPipes(new ValidationPipe()); // Enable validation globally
  await app.listen(3001); // Running on a different port than frontend
}
bootstrap();


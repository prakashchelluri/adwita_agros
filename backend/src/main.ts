import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  });
  console.log(`CORS configured for origin: ${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
  app.useGlobalPipes(new ValidationPipe()); // Enable validation globally
  await app.listen(3001); // Change the port to 3001
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
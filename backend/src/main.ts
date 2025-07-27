import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable Cross-Origin Resource Sharing
  app.useGlobalPipes(new ValidationPipe()); // Enable validation globally
  await app.listen(3001); // Running on a different port than frontend
}
bootstrap();


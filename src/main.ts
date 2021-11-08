import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3003);

  Logger.log(`Starting server`);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);

  Logger.log(`Starting server`);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

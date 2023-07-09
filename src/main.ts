import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import validationConfig from './config/validation.config';
import { UnprocessableEntityExceptionFilter } from './filters/unprocessable-entity-exception.filter';
import { ResponseCustomInterceptor } from './interceptors/response-custom.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe(validationConfig()));

  app.useGlobalFilters(
    new UnprocessableEntityExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(new ResponseCustomInterceptor());

  await app.listen(
    configService.get<number>('PORT', 3000),
    configService.get<string>('HOST', 'localhost'),
  );
}

bootstrap();

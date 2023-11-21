import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import validationConfig from './app/config/validation.config';
import { UnprocessableEntityExceptionFilter } from './app/filters/unprocessable-entity-exception.filter';
import { ResponseCustomInterceptor } from './app/interceptors/response-custom.interceptor';
import { HttpExceptionFilter } from './app/filters/http-exception.filter';
import corsConfig from './app/config/cors.config';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', 'localhost');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe(validationConfig()));

  app.useGlobalFilters(
    new UnprocessableEntityExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(new ResponseCustomInterceptor());

  app.enableCors(corsConfig());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

bootstrap();

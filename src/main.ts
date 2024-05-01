import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import validationConfig from './app/config/validation.config';
import { UnprocessableEntityExceptionFilter } from './app/filters/unprocessable-entity-exception.filter';
import { ResponseCustomInterceptor } from './app/interceptors/response-custom.interceptor';
import { HttpExceptionFilter } from './app/filters/http-exception.filter';
import corsConfig from './app/config/cors.config';
import { useContainer } from 'class-validator';
import { DataSource } from 'typeorm';
import { Seeder } from './database/seeders/seeder';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', 'localhost');
  const dataSource: DataSource = app.get(DataSource);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe(validationConfig(configService)));

  app.useGlobalFilters(
    new UnprocessableEntityExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(new ResponseCustomInterceptor());

  app.enableCors(corsConfig(configService));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await Seeder.run(dataSource, configService);

  await app.listen(port, host, () => {
    logger.log(`Server is running on ${host}:${port}`);
  });
}

bootstrap();

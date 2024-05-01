import 'dotenv/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService): CorsOptions => {
  const originEnv = configService.get<string>('CORS_ORIGIN', '*');
  const origin = originEnv.includes(',') ? originEnv.split(',') : originEnv;

  return {
    origin,
    methods: configService.get<string>(
      'CORS_METHODS',
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    ),
    preflightContinue: false,
    optionsSuccessStatus: parseInt(
      configService.get<string>('CORS_OPTIONS_SUCCESS_STATUS', '204'),
      10,
    ),
    credentials:
      configService.get<string>('CORS_CREDENTIALS', 'true') === 'true',
    allowedHeaders: configService.get<string>('CORS_ALLOWED_HEADERS', '*'),
    maxAge: parseInt(configService.get<string>('CORS_MAX_AGE', '86400'), 10),
  };
};

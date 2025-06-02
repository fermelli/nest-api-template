import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService): CorsOptions => {
  const originEnv = configService.get<string>('CORS_ORIGIN');
  const origin = originEnv.includes(',') ? originEnv.split(',') : originEnv;

  return {
    origin,
    methods: configService.get<string>('CORS_METHODS'),
    preflightContinue: false,
    optionsSuccessStatus: configService.get<number>(
      'CORS_OPTIONS_SUCCESS_STATUS',
    ),
    credentials: configService.get<boolean>('CORS_CREDENTIALS'),
    allowedHeaders: configService.get<string>('CORS_ALLOWED_HEADERS'),
    maxAge: configService.get<number>('CORS_MAX_AGE'),
  };
};

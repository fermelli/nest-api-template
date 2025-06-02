import { ValidationPipeOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import exceptionFactory from 'src/app/factories/exception.factory';
import { Environment } from '../enviroment/environment-variables';

export default (configService: ConfigService): ValidationPipeOptions => ({
  enableDebugMessages:
    configService.get<string>('NODE_ENV', 'development') === 'development',
  skipMissingProperties: false,
  whitelist: true,
  transform: true,
  exceptionFactory: exceptionFactory,
});

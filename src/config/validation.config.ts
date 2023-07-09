import { ValidationPipeOptions } from '@nestjs/common';
import exceptionFactory from 'src/factories/exception.factory';

export default (): ValidationPipeOptions => ({
  enableDebugMessages: process.env.ENV === 'development',
  skipMissingProperties: false,
  whitelist: true,
  transform: true,
  exceptionFactory: exceptionFactory,
});

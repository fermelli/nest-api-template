import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export default (): CorsOptions => ({
  origin: process.env.CORS_ORIGIN.includes(',')
    ? process.env.CORS_ORIGIN.split(',')
    : process.env.CORS_ORIGIN || '*',
  methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus:
    parseInt(process.env.CORS_OPTIONS_SUCCESS_STATUS, 10) || 204,
  credentials: process.env.CORS_CREDENTIALS == 'true' || false,
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS || '*',
  maxAge: parseInt(process.env.CORS_MAX_AGE, 10) || 86400,
});

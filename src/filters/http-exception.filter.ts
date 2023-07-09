import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getDefaultMessage } from 'src/utils/get-default-message.util';

@Catch(NotFoundException, BadRequestException, InternalServerErrorException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | NotFoundException
      | BadRequestException
      | InternalServerErrorException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const defaultMessage = getDefaultMessage(exception);

    response.status(status).json({
      message: exception.message || defaultMessage,
      statusCode: status,
      data: null,
      path: request.url,
      errors: exception.message,
    });
  }
}

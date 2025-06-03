import {
  ArgumentsHost,
  BadGatewayException,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
  PayloadTooLargeException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getDefaultMessage } from 'src/app/utils/get-default-message.util';

@Catch(
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  RequestTimeoutException,
  PayloadTooLargeException,
  InternalServerErrorException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | BadRequestException
      | UnauthorizedException
      | NotFoundException
      | ForbiddenException
      | RequestTimeoutException
      | PayloadTooLargeException
      | InternalServerErrorException
      | MethodNotAllowedException
      | BadGatewayException
      | ServiceUnavailableException,
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

import {
  HttpException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  UnauthorizedException,
  PayloadTooLargeException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';

export const getDefaultMessage = (exception: HttpException): string => {
  if (exception instanceof BadRequestException) {
    return 'Bad request';
  }

  if (exception instanceof UnauthorizedException) {
    return 'Unauthorized access';
  }

  if (exception instanceof NotFoundException) {
    return 'Not found';
  }

  if (exception instanceof ForbiddenException) {
    return 'Forbidden access';
  }

  if (exception instanceof PayloadTooLargeException) {
    return 'Payload too large';
  }

  if (exception instanceof InternalServerErrorException) {
    return 'Internal server error';
  }

  if (exception instanceof MethodNotAllowedException) {
    return 'Method not allowed';
  }

  if (exception instanceof BadGatewayException) {
    return 'Bad gateway';
  }

  if (exception instanceof ServiceUnavailableException) {
    return 'Service unavailable';
  }

  if (exception instanceof ForbiddenException) {
    return 'Forbidden access';
  }

  return 'Something went wrong';
};

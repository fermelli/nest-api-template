import {
  HttpException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';

export const getDefaultMessage = (exception: HttpException): string => {
  if (exception instanceof BadRequestException) {
    return 'Bad request';
  }

  if (exception instanceof NotFoundException) {
    return 'Not found';
  }

  if (exception instanceof InternalServerErrorException) {
    return 'Internal server error';
  }

  if (exception instanceof ForbiddenException) {
    return 'Forbidden access';
  }

  return 'Something went wrong';
};

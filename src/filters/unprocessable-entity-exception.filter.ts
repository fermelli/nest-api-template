import {
  ExceptionFilter,
  Catch,
  UnprocessableEntityException,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';

export class UnprocessableEntityExceptionValidation extends UnprocessableEntityException {
  constructor(public errorMessages: ErrorMessages) {
    super();
  }
}

@Catch(UnprocessableEntityExceptionValidation)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(
    exception: UnprocessableEntityExceptionValidation,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = 'Validation failed';

    response.status(status).json({
      message,
      statusCode: status,
      data: null,
      path: request.url,
      errors: exception.errorMessages,
    });
  }
}

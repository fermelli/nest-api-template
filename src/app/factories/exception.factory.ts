import { ValidationError } from 'class-validator';
import { UnprocessableEntityExceptionValidation } from 'src/app/filters/unprocessable-entity-exception.filter';
import { ErrorMessages } from 'src/app/interfaces/error-messages.interface';
import { processErrors } from 'src/app/utils/process-errors.util';

export default (errors: ValidationError[]) => {
  const messages: ErrorMessages = {};

  processErrors(errors, messages);

  return new UnprocessableEntityExceptionValidation(messages);
};

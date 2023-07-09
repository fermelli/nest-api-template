import { ValidationError } from 'class-validator';
import { UnprocessableEntityExceptionValidation } from 'src/filters/unprocessable-entity-exception.filter';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { processErrors } from 'src/utils/process-errors.util';

export default (errors: ValidationError[]) => {
  const messages: ErrorMessages = {};

  processErrors(errors, messages);

  return new UnprocessableEntityExceptionValidation(messages);
};

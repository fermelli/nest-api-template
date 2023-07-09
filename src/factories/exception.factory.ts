import { UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { processErrors } from 'src/utils/process-errors.util';

export default (errors: ValidationError[]) => {
  const messages = {};

  processErrors(errors, messages);

  return new UnprocessableEntityException(messages);
};

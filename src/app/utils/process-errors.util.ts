import { ValidationError } from 'class-validator';
import { ErrorMessages } from 'src/app/interfaces/error-messages.interface';

export const processErrors = (
  errors: ValidationError[] | ValidationError,
  errorMessages: ErrorMessages,
  property = '',
) => {
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      processErrors(error, errorMessages, property);
    });
  } else {
    if (errors.children && errors.children.length > 0) {
      errors.children.forEach((errorChildren) => {
        const newProperty = `${property}${property ? '.' : ''}${
          errors.property
        }`;

        processErrors(errorChildren, errorMessages, newProperty);
      });
    } else {
      const newProperty = `${property}${property ? '.' : ''}${errors.property}`;

      errorMessages[newProperty] = Object.values(errors.constraints);
    }
  }
};

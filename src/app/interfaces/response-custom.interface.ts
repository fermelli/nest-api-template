import { ErrorMessages } from './error-messages.interface';

export interface ResponseCustom<T> {
  message?: string;
  statusCode?: number;
  data?: T | null;
  path?: string;
  errors?: ErrorMessages | null;
}

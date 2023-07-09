import { ErrorMessages } from './error-messages.interface';

export interface ResponseCustom<T> {
  message: string;
  statusCode?: number;
  data?: T[] | T | null;
  url?: string;
  errors?: ErrorMessages | null;
}

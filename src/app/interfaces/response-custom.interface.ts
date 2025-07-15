import { ErrorMessages } from './error-messages.interface';

export interface Metadata {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ResponseCustom<T> {
  message?: string;
  statusCode?: number;
  data?: T | null;
  path?: string;
  errors?: ErrorMessages | null;
  metadata?: Metadata | null;
}

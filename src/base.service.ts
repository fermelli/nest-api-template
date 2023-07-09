import {
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { UnprocessableEntityExceptionValidation } from './filters/unprocessable-entity-exception.filter';
import { extractField, extractValue } from './utils/extract-text.util';

export class BaseService {
  private readonly logger = new Logger();

  protected handleErrors(error: any): void {
    console.log(error);

    this.logger.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      const message = error.sqlMessage;
      const sql = error.sql;
      const value = extractValue(message);
      const field = extractField(sql, value);

      if (field && value) {
        throw new UnprocessableEntityExceptionValidation({
          [field]: [`${field} duplicated value ${value}`],
        });
      }

      throw new BadRequestException('Duplicated value');
    }

    if (error.code === 'ECONNREFUSED') {
      throw new InternalServerErrorException('Database connection error');
    }

    throw new InternalServerErrorException();
  }
}

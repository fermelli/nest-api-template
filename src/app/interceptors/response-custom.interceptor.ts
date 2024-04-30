import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseCustom } from 'src/app/interfaces/response-custom.interface';
import { Request, Response } from 'express';
import { getPath } from 'src/app/utils/get-path.util';

@Injectable()
export class ResponseCustomInterceptor<T>
  implements NestInterceptor<T, ResponseCustom<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseCustom<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestUrl = request.url;

    return next.handle().pipe(
      map((res: ResponseCustom<T>) => {
        const message = res?.message || 'Request success';
        const statusCode = response?.statusCode || HttpStatus.OK;
        const data = res?.data || null;
        const errors = res?.errors || null;
        const path = getPath(requestUrl, data);

        return {
          message,
          statusCode,
          data,
          path,
          errors,
        };
      }),
    );
  }
}

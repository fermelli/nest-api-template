import {
  CallHandler,
  ExecutionContext,
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
    const host = request.headers.host;
    const requestUrl = request.url;

    return next.handle().pipe(
      map((res: ResponseCustom<T>) => {
        const { message, data, errors } = res;

        const path = getPath(host, requestUrl, data);

        return {
          message: message || 'Request success',
          statusCode: response.statusCode,
          data: data || null,
          path: path || null,
          errors: errors || null,
        };
      }),
    );
  }
}

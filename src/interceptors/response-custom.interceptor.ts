import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseCustom } from 'src/interfaces/response-custom.interface';

@Injectable()
export class ResponseCustomInterceptor<T>
  implements NestInterceptor<T, ResponseCustom<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseCustom<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        statusCode: response.statusCode,
        data: data.data || null,
        url: request.url || null,
        errors: data.errors || null,
      })),
    );
  }
}

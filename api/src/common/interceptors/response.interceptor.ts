import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseShape } from '../interfaces';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseShape<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseShape<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: 'Request successful',
        data: data ?? null,
      })),
    );
  }
}

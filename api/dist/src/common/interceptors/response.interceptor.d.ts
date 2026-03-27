import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiResponseShape } from '../interfaces';
export declare class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponseShape<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseShape<T>>;
}

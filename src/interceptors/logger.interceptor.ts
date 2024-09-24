import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Body } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import logger from '../common/logger'


@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const body = req.body;
    const startTime = Date.now();

    logger.info(`[Request] ${method} ${url}${method !== 'GET' && !body.password ? 
      ` - Body: ${JSON.stringify(body)}` : ''}`);

    return next
      .handle()
      .pipe(
        tap((data) => {
          const endTime = Date.now();
          logger.info(`[Response] ${endTime - startTime}ms - ${method} ${url} - ${JSON.stringify(data)}`);
        }),
        catchError(err => {
            const endTime = Date.now();
            logger.error(`[Error] ${endTime - startTime}ms - ${method} ${url} - ${err.message}`);
            return throwError(() => err)
        }),
      );
  }
}
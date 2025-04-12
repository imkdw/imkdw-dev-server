import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from './exception.type';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const isHttpException = exception instanceof HttpException;

    const exceptionResponse = isHttpException
      ? (exception.getResponse() as ExceptionResponse)
      : ({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: 'Internal Server Error',
          message: 'Internal Server Error',
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
          ...(process.env.NODE_ENV === 'local' && { stack: (exception as any)?.stack || '' }),
        } satisfies ExceptionResponse);

    const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ExceptionResponse = {
      statusCode: httpStatus,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      errorCode: exceptionResponse.errorCode,
      message: exceptionResponse.message,
      stack: exceptionResponse.stack,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionResponse } from './exception.type';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

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
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          stack: (exception as any)?.stack || '',
        } satisfies ExceptionResponse);

    const httpStatus = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ExceptionResponse = {
      statusCode: httpStatus,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      errorCode: exceptionResponse.errorCode,
      message: exceptionResponse.message,
      stack: process.env.NODE_ENV === 'local' ? exceptionResponse.stack : '',
    };

    this.logger.error(exceptionResponse);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

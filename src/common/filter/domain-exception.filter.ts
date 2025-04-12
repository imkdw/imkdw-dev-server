import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { DomainException } from '../domain/exception/domain.exception';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { errorCode, message, statusCode } = exception;
    const { httpAdapter } = this.httpAdapterHost;

    this.logger.error(exception.message);

    const responseBody = {
      statusCode,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), { error: responseBody }, statusCode);
  }
}

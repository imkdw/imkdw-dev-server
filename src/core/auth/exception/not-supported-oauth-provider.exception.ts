import { DomainException } from '@/common/domain/exception/domain.exception';
import { ErrorCode } from '@/common/domain/exception/error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class NotSupportedOAuthProviderException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.NOT_SUPPORTED_OAUTH_PROVIDER,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

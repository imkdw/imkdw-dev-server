import { DomainException } from '@/common/domain/exception/domain.exception';
import { ErrorCode } from '@/common/domain/exception/error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class JwtExpiredException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.JWT_EXPIRED,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}

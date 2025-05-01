import { DomainException } from '@/common/domain/exception/domain.exception';
import { ErrorCode } from '@/common/domain/exception/error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class SignInFailureException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.SIGN_IN_FAILED,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}

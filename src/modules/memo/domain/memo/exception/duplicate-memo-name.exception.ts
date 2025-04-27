import { DomainException } from '@/common/domain/exception/domain.exception';
import { ErrorCode } from '@/common/domain/exception/error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class DuplicateMemoNameException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.DUPLICATE_MEMO_NAME,
      statusCode: HttpStatus.CONFLICT,
    });
  }
}

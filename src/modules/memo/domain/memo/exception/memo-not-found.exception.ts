import { DomainException } from '@/common/domain/exception/domain.exception';
import { ErrorCode } from '@/common/domain/exception/error-code.enum';
import { HttpStatus } from '@nestjs/common';

export class MemoNotFoundException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.MEMO_FOLDER_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}

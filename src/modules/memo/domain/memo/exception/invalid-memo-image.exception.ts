import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../../common/domain/exception/domain.exception';
import { ErrorCode } from '../../../../../common/domain/exception/error-code.enum';

export class InvalidMemoImageException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.INVALID_MEMO_IMAGE,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

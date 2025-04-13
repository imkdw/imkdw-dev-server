import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../../common/domain/exception/domain.exception';
import { ErrorCode } from '../../../../../common/domain/exception/error-code.enum';

export class DuplicateMemoFolderNameException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.DUPLICATE_MEMO_FOLDER_NAME,
      statusCode: HttpStatus.CONFLICT,
    });
  }
}

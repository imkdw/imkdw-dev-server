import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../../common/domain/exception/domain.exception';
import { ErrorCode } from '../../../../../common/domain/exception/error-code.enum';

export class MemoFolderNotFoundException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.MEMO_FOLDER_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}

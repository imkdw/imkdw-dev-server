import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../../../../../common/domain/exception/error-code.enum';
import { DomainException } from '../../../../../common/domain/exception/domain.exception';

export class MemoFolderNotFoundException extends DomainException {
  constructor(message: string) {
    super({
      message,
      errorCode: ErrorCode.MEMO_FOLDER_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}

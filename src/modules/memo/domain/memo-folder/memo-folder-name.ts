import { InvalidMemoFolderNameException } from './exception/invalid-memo-folder-name.exception';

export class MemoFolderName {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 100;

  readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (!value) {
      throw new InvalidMemoFolderNameException('Memo folder name cannot be empty');
    }

    if (value.length < MemoFolderName.MIN_LENGTH) {
      throw new InvalidMemoFolderNameException(
        `Memo folder name must be at least ${MemoFolderName.MIN_LENGTH} character long`,
      );
    }

    if (value.length > MemoFolderName.MAX_LENGTH) {
      throw new InvalidMemoFolderNameException(
        `Memo folder name must be at most ${MemoFolderName.MAX_LENGTH} characters long`,
      );
    }
  }
}

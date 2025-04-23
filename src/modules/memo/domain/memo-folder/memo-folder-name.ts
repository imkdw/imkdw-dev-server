import { InvalidMemoFolderNameException } from './exception/invalid-memo-folder-name.exception';

export class MemoFolderName {
  static readonly MIN_LENGTH = 2;
  static readonly MAX_LENGTH = 100;

  readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (value.length < MemoFolderName.MIN_LENGTH) {
      throw new InvalidMemoFolderNameException(
        `메모 폴더 이름은 최소 ${MemoFolderName.MIN_LENGTH} 글자 이상이어야 합니다.`,
      );
    }

    if (value.length > MemoFolderName.MAX_LENGTH) {
      throw new InvalidMemoFolderNameException(
        `메모 폴더 이름은 최대 ${MemoFolderName.MAX_LENGTH} 글자 이하여야 합니다.`,
      );
    }
  }
}

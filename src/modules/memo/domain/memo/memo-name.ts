import { InvalidMemoNameException } from '@/memo/domain/memo/exception/invalid-memo-folder-name.exception';

export class MemoName {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 100;

  readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (value.length < MemoName.MIN_LENGTH) {
      throw new InvalidMemoNameException(`메모 이름은 최소 ${MemoName.MIN_LENGTH} 글자 이상이어야 합니다.`);
    }

    if (value.length > MemoName.MAX_LENGTH) {
      throw new InvalidMemoNameException(`메모 이름은 최대 ${MemoName.MAX_LENGTH} 글자 이하여야 합니다.`);
    }
  }
}

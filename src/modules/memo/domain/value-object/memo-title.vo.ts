export class MemoTitle {
  private static readonly MAX_LENGTH = 100;
  private static readonly MIN_LENGTH = 1;

  constructor(private readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value) {
      throw new Error('메모 제목은 필수입니다.');
    }

    if (this.value.length < MemoTitle.MIN_LENGTH) {
      throw new Error(`메모 제목은 최소 ${MemoTitle.MIN_LENGTH}자 이상이어야 합니다.`);
    }

    if (this.value.length > MemoTitle.MAX_LENGTH) {
      throw new Error(`메모 제목은 최대 ${MemoTitle.MAX_LENGTH}자까지 가능합니다.`);
    }
  }

  toString(): string {
    return this.value;
  }
}

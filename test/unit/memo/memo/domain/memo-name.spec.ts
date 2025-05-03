import { InvalidMemoNameException } from '@/memo/domain/memo/exception/invalid-memo-folder-name.exception';
import { MemoName } from '@/memo/domain/memo/memo-name';

describe('메모 이름을 생성할 때', () => {
  it('유효한 이름이면 성공적으로 생성된다', () => {
    const value = '유효한 메모 이름';

    const sut = new MemoName(value);

    expect(sut.value).toBe(value);
  });

  it('최소 길이보다 짧으면 예외가 발생한다', () => {
    const emptyName = '';

    expect(() => {
      new MemoName(emptyName);
    }).toThrow(InvalidMemoNameException);
  });

  it('최대 길이보다 길면 예외가 발생한다', () => {
    const longName = 'a'.repeat(9999);

    expect(() => {
      new MemoName(longName);
    }).toThrow(InvalidMemoNameException);
  });
});

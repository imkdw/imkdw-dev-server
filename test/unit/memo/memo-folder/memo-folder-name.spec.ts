import { InvalidMemoFolderNameException } from '@/memo/domain/memo-folder/exception/invalid-memo-folder-name.exception';
import { MemoFolderName } from '@/memo/domain/memo-folder/memo-folder-name';

describe('빈 문자열로 메모 폴더를 만드는 경우', () => {
  it('에러가 발생한다', () => {
    expect(() => new MemoFolderName('')).toThrow(InvalidMemoFolderNameException);
  });
});

describe('한글자로 메모 폴더를 생성하는 경우', () => {
  it('에러가 발생한다', () => {
    expect(() => new MemoFolderName('a')).toThrow(InvalidMemoFolderNameException);
  });
});

describe('메모 폴더명의 최대 글자수를 초과하는 경우', () => {
  it('에러가 발생한다', () => {
    expect(() => new MemoFolderName('a'.repeat(MemoFolderName.MAX_LENGTH + 1))).toThrow(InvalidMemoFolderNameException);
  });
});

describe('메모 폴더명에 유효한 문자열을 입력하는 경우', () => {
  it('메모 폴더가 생성된다', () => {
    const sut = new MemoFolderName('test');

    expect(sut.value).toBe('test');
  });
});

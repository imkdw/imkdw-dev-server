import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { isUUID } from '../../../utils/uuid.util';

describe('새로운 메모 폴더를 만드는 경우', () => {
  it('UUID 형식의 아이디가 할당된다', () => {
    const sut = MemoFolder.create('test', null);

    expect(isUUID(sut.id)).toBe(true);
  });
});

describe('메모 폴더의 부모가 없을때', () => {
  describe('새로운 메모 폴더를 생성하면', () => {
    it('메모 폴더가 생성된다', () => {
      const sut = MemoFolder.create('test', null);

      expect(sut.name.value).toBe('test');
      expect(sut.parentId).toBeNull();
    });
  });
});

describe('메모 폴더의 부모가 주어지고', () => {
  const parent = MemoFolder.create('parent', null);
  describe('새로운 메모 폴더를 만드는 경우', () => {
    it('부모 폴더가 설정된다', () => {
      const sut = MemoFolder.create('test', parent.id);

      expect(sut.name.value).toBe('test');
      expect(sut.parentId).toBe(parent.id);
    });
  });
});

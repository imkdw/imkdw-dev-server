import { Memo } from '@/memo/domain/memo/memo';
import { validate } from 'uuid';

describe('새로운 메모를 만드는 경우', () => {
  it('UUID 형식의 아이디가 할당된다', () => {
    const sut = Memo.create('test', 'test-slug', '메모 내용', 'folder-id', '/folder');

    expect(validate(sut.id)).toBe(true);
  });
});

describe('메모를 생성하면', () => {
  it('메모가 생성된다', () => {
    const name = 'test';
    const slug = 'test-slug';
    const content = '메모 내용';
    const folderId = 'folder-id';
    const folderPath = '/folder';

    const sut = Memo.create(name, slug, content, folderId, folderPath);

    expect(sut.name.value).toBe(name);
    expect(sut.slug).toBe(slug);
    expect(sut.content).toBe(content);
    expect(sut.folderId).toBe(folderId);
    expect(sut.path).toBe('/folder/test');
    expect(sut.deletedAt).toBeNull();
  });
});

describe('경로 생성 시', () => {
  it('폴더 경로와 이름을 조합하여 경로가 생성된다', () => {
    const name = 'test';
    const folderPath = '/folder';

    const path = Memo.generatePath(name, folderPath);

    expect(path).toBe('/folder/test');
  });
});

describe('메모를 삭제하면', () => {
  it('삭제한 날짜가 설정된다', () => {
    const sut = Memo.create('test', 'test-slug', '메모 내용', 'folder-id', '/folder');

    sut.delete();

    expect(sut.deletedAt).not.toBeNull();
  });
});

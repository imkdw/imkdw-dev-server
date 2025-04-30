import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { Memo } from '@/memo/domain/memo/memo';

export const parentDummyFolders = Array.from({ length: 100 }, (_, i) => MemoFolder.create(`부모폴더(${i + 1})`, null));

export const childDummyFolders = Array.from({ length: 100 }, (_, i) => {
  const parentIndex = i % parentDummyFolders.length;
  const parentFolder = parentDummyFolders[parentIndex];
  return MemoFolder.create(`자식폴더(${i + 1})`, parentFolder.id, parentFolder.path);
});

// 모든 폴더의 배열 생성 (부모 폴더 + 자식 폴더)
export const allFolders = [...parentDummyFolders, ...childDummyFolders];

// 각 폴더에 랜덤으로 0~5개의 메모 생성
export const memoDummies = allFolders.flatMap((folder) => {
  // 각 폴더에 0~5개의 메모를 생성
  const memoCount = Math.floor(Math.random() * 6); // 0~5 랜덤 생성
  return Array.from({ length: memoCount }, (_, i) => {
    const memoName = `메모-${folder.name.value}-(${i + 1})`;
    const slug = memoName.replace(/\s+/g, '-').toLowerCase();
    const content = `이것은 ${folder.name.value}의 ${i + 1}번째 메모 내용입니다.`;

    // Memo.create에 folder.id와 folder.path를 전달
    return Memo.create(memoName, slug, content, folder.id, folder.path);
  });
});

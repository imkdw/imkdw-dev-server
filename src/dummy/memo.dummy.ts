import { generateUUID } from '@/common/utils/string.util';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { Memo } from '@/memo/domain/memo/memo';

// 깊이별 폴더를 저장할 객체
const foldersByDepth: { [depth: number]: MemoFolder[] } = {};
const MAX_DEPTH = 2;

// 최상위 폴더 생성 (depth 1)
foldersByDepth[1] = Array.from({ length: 5 }, (_) => MemoFolder.create(generateUUID(), null));

// 깊이 2부터 MAX_DEPTH까지 각 깊이별 폴더 생성
for (let depth = 2; depth <= MAX_DEPTH; depth++) {
  foldersByDepth[depth] = [];

  // 이전 depth의 각 폴더마다 1~3개의 하위 폴더 생성
  foldersByDepth[depth - 1].forEach((parentFolder) => {
    const childCount = Math.floor(Math.random() * 3) + 1; // 1~3개의 하위 폴더

    for (let i = 0; i < childCount; i++) {
      const childFolder = MemoFolder.create(generateUUID(), parentFolder.id, parentFolder.path);
      foldersByDepth[depth].push(childFolder);
    }
  });
}

// 모든 폴더를 하나의 배열로 합치기
export const allFolders = Object.values(foldersByDepth).flat();

// 각 폴더에 1~3개의 메모 생성
export const memoDummies = allFolders.flatMap((folder) => {
  const memoCount = Math.floor(Math.random() * 3) + 1; // 1~3개의 메모
  return Array.from({ length: memoCount }, (_, i) => {
    const memoName = `Memo_${i + 1}_In_${folder.name.value}`;
    const slug = memoName.replace(/\s+/g, '-').toLowerCase();
    const content = `This is memo ${i + 1} in the folder ${folder.name.value}. This folder is at path ${folder.path}.`;
    const contentHtml = `<h1>${memoName}</h1><p>${content}</p>`;

    return Memo.create(memoName, slug, content, contentHtml, folder.id, folder.path);
  });
});

// 기존 로직에서 parentDummyFolders와 childDummyFolders가 필요한 경우를 위해 재정의
export const parentDummyFolders = foldersByDepth[1];
export const childDummyFolders = Object.values(foldersByDepth).slice(1).flat();

// 특별한 시나리오 테스트를 위한 깊은 경로 예시 (depth 1 -> 2 -> 3 -> ... -> 10)
export const deepPathExample = (() => {
  const result: { folders: MemoFolder[]; memos: Memo[] } = { folders: [], memos: [] };
  let currentParentId = null;
  let currentPath = '';

  for (let depth = 1; depth <= MAX_DEPTH; depth++) {
    const folder = MemoFolder.create(generateUUID(), currentParentId, currentPath);
    result.folders.push(folder);

    // 각 깊이 폴더에 메모 추가
    const memo = Memo.create(
      generateUUID(),
      `memo-in-deep-path-depth-${depth}`,
      `Content of memo in deep path at depth ${depth}`,
      `<h1>Memo in deep path at depth ${depth}</h1><p>Content of memo in deep path at depth ${depth}</p>`,
      folder.id,
      folder.path,
    );
    result.memos.push(memo);

    currentParentId = folder.id;
    currentPath = folder.path;
  }

  return result;
})();

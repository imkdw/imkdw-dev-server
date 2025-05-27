import { PrismaClient } from '@prisma/client';
import { childDummyFolders, memoDummies, parentDummyFolders } from 'src/dummy/memo.dummy';

const prisma = new PrismaClient();

export async function createDummy() {
  await prisma.memo.deleteMany();
  await prisma.memoFolder.deleteMany();

  // 부모 폴더 생성
  await prisma.memoFolder.createMany({
    data: parentDummyFolders.map((folder) => ({ ...folder, name: folder.name.value })),
  });

  // 자식 폴더 생성
  await prisma.memoFolder.createMany({
    data: childDummyFolders.map((folder) => ({ ...folder, name: folder.name.value })),
  });

  // 메모 생성
  await prisma.memo.createMany({
    data: memoDummies.map((memo) => ({
      ...memo,
      name: memo.name.value,
      content: memo.content.value,
      contentHtml: memo.contentHtml.value,
    })),
  });
}

createDummy();

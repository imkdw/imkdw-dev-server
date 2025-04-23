import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/core/database/prisma.service';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { FindRootMemoFoldersService } from '@/memo/service/memo-folder/find-root-memo-folders.service';
import { Test } from '@nestjs/testing';

describe(FindRootMemoFoldersService.name, () => {
  let prisma: PrismaService;
  let sut: FindRootMemoFoldersService;
  let memoFolderRepository: MemoFolderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        {
          provide: MEMO_FOLDER_REPOSITORY,
          useClass: PrismaMemoFolderRepository,
        },
        FindRootMemoFoldersService,
      ],
    }).compile();

    sut = module.get<FindRootMemoFoldersService>(FindRootMemoFoldersService);
    prisma = module.get<PrismaService>(PrismaService);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);

    await prisma.memoFolder.deleteMany();
  });

  describe('최상위 폴더가 없을 때', () => {
    it('빈 배열을 반환한다', async () => {
      const result = await sut.execute();

      expect(result).toEqual([]);
    });
  });

  describe('최상위 폴더가 있을 때', () => {
    it('최상위 폴더 목록을 반환한다', async () => {
      const rootFolder1 = MemoFolder.create('root1', null);
      const rootFolder2 = MemoFolder.create('root2', null);
      await memoFolderRepository.save(rootFolder1);
      await memoFolderRepository.save(rootFolder2);

      const result = await sut.execute();

      expect(result).toHaveLength(2);
      expect(result.map((folder) => folder.id)).toEqual(expect.arrayContaining([rootFolder1.id, rootFolder2.id]));
      expect(result.map((folder) => folder.name.value)).toEqual(
        expect.arrayContaining([rootFolder1.name.value, rootFolder2.name.value]),
      );
    });

    it('각 최상위 폴더의 경로가 폴더명과 동일하다', async () => {
      const rootFolder1 = MemoFolder.create('root1', null);
      const rootFolder2 = MemoFolder.create('root2', null);
      await memoFolderRepository.save(rootFolder1);
      await memoFolderRepository.save(rootFolder2);

      const result = await sut.execute();

      // 모든 최상위 폴더의 경로는 폴더명과 같아야 함
      for (const folder of result) {
        expect(folder.path).toBe(folder.name.value);
      }
    });
  });

  describe('최상위 폴더와 하위 폴더가 모두 있을 때', () => {
    it('최상위 폴더만 반환한다', async () => {
      const parentFolder = MemoFolder.create('parent', null);
      const childFolder = MemoFolder.create('child', parentFolder.id);
      await memoFolderRepository.save(parentFolder);
      await memoFolderRepository.save(childFolder);

      const result = await sut.execute();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(parentFolder.id);
      expect(result[0].name.value).toBe(parentFolder.name.value);
      expect(result[0].parentId).toBeNull();
    });
  });

  describe('경로(path) 테스트', () => {
    describe('다양한 최상위 폴더가 있을 때', () => {
      it('각 최상위 폴더의 경로는 폴더명과 동일하다', async () => {
        // 여러 최상위 폴더 생성
        const rootFolders = [
          MemoFolder.create('folder1', null),
          MemoFolder.create('folder2', null),
          MemoFolder.create('folder3', null),
        ];

        for (const folder of rootFolders) {
          await memoFolderRepository.save(folder);
        }

        // 최상위 폴더 조회
        const result = await sut.execute();

        // 경로 확인
        expect(result).toHaveLength(rootFolders.length);
        for (const folder of result) {
          expect(folder.path).toBe(folder.name.value);
        }
      });
    });

    describe('최상위 폴더와 복잡한 하위 구조가 있을 때', () => {
      it('하위 폴더를 제외한 최상위 폴더만 조회되며 경로가 정확하다', async () => {
        // 최상위 폴더 생성
        const rootFolder1 = MemoFolder.create('root1', null);
        const rootFolder2 = MemoFolder.create('root2', null);
        await memoFolderRepository.save(rootFolder1);
        await memoFolderRepository.save(rootFolder2);

        // 하위 폴더 구조 생성
        const subFolder1 = MemoFolder.create('sub1', rootFolder1.id);
        subFolder1.updatePath(`${rootFolder1.path}/${subFolder1.name.value}`);
        await memoFolderRepository.save(subFolder1);

        const subSubFolder = MemoFolder.create('subsub', subFolder1.id);
        subSubFolder.updatePath(`${subFolder1.path}/${subSubFolder.name.value}`);
        await memoFolderRepository.save(subSubFolder);

        const subFolder2 = MemoFolder.create('sub2', rootFolder2.id);
        subFolder2.updatePath(`${rootFolder2.path}/${subFolder2.name.value}`);
        await memoFolderRepository.save(subFolder2);

        // 최상위 폴더 조회
        const result = await sut.execute();

        // 최상위 폴더만 반환되는지 확인
        expect(result).toHaveLength(2);
        expect(result.map((folder) => folder.id)).toContain(rootFolder1.id);
        expect(result.map((folder) => folder.id)).toContain(rootFolder2.id);

        // 모든 최상위 폴더의 경로는 폴더명과 같아야 함
        for (const folder of result) {
          expect(folder.path).toBe(folder.name.value);
        }
      });
    });
  });
});

import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/core/database/prisma.service';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { FindChildMemoFoldersService } from '@/memo/service/memo-folder/find-child-memo-folders.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Test } from '@nestjs/testing';

describe(FindChildMemoFoldersService.name, () => {
  let prisma: PrismaService;
  let sut: FindChildMemoFoldersService;
  let memoFolderRepository: MemoFolderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        MemoFolderValidator,
        {
          provide: MEMO_FOLDER_REPOSITORY,
          useClass: PrismaMemoFolderRepository,
        },
        FindChildMemoFoldersService,
      ],
    }).compile();

    sut = module.get<FindChildMemoFoldersService>(FindChildMemoFoldersService);
    prisma = module.get<PrismaService>(PrismaService);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);

    await prisma.memoFolder.deleteMany();
  });

  describe('존재하지 않는 부모 폴더의 자식 폴더 목록을 조회하면', () => {
    it('에러가 발생한다', async () => {
      await expect(sut.execute('non-existent-id')).rejects.toThrow(MemoFolderNotFoundException);
    });
  });

  describe('자식 폴더가 없는 부모 폴더의 자식 목록을 조회하면', () => {
    const parentFolder = MemoFolder.create('parent', null);
    it('빈 배열을 반환한다', async () => {
      await memoFolderRepository.save(parentFolder);

      const result = await sut.execute(parentFolder.id);

      expect(result).toEqual([]);
    });
  });

  describe('자식 폴더가 있는 부모 폴더 ID로 조회할 때', () => {
    const parentFolder = MemoFolder.create('parent', null);
    it('자식 폴더 목록을 반환한다', async () => {
      await memoFolderRepository.save(parentFolder);

      // 자식 폴더 생성
      const childFolder1 = MemoFolder.create('child1', parentFolder.id);
      const childFolder2 = MemoFolder.create('child2', parentFolder.id);
      await memoFolderRepository.save(childFolder1);
      await memoFolderRepository.save(childFolder2);

      // 부모 폴더의 자식 폴더가 아닌 다른 폴더 생성
      const anotherParentFolder = MemoFolder.create('another-parent', null);
      const anotherChildFolder = MemoFolder.create('another-child', anotherParentFolder.id);
      await memoFolderRepository.save(anotherParentFolder);
      await memoFolderRepository.save(anotherChildFolder);

      const result = await sut.execute(parentFolder.id);

      expect(result).toHaveLength(2);
      expect(result.map((folder) => folder.id)).toEqual(expect.arrayContaining([childFolder1.id, childFolder2.id]));
      expect(result.map((folder) => folder.name.value)).toEqual(
        expect.arrayContaining([childFolder1.name.value, childFolder2.name.value]),
      );
      expect(result.map((folder) => folder.path)).toEqual(
        expect.arrayContaining([
          `${parentFolder.path}/${childFolder1.name.value}`,
          `${parentFolder.path}/${childFolder2.name.value}`,
        ]),
      );
    });
  });

  describe('폴더 경로(path) 테스트', () => {
    describe('자식 폴더의 경로 확인', () => {
      it('부모 경로/자식명 형식으로, 각 자식 폴더의 정확한 경로를 포함한다', async () => {
        // 부모 폴더 생성
        const parentFolder = MemoFolder.create('parent', null);
        await memoFolderRepository.save(parentFolder);

        // 자식 폴더 생성 - 경로 설정
        const childFolder1 = MemoFolder.create('child1', parentFolder.id);
        childFolder1.updatePath(`${parentFolder.path}/${childFolder1.name.value}`);
        await memoFolderRepository.save(childFolder1);

        const childFolder2 = MemoFolder.create('child2', parentFolder.id);
        childFolder2.updatePath(`${parentFolder.path}/${childFolder2.name.value}`);
        await memoFolderRepository.save(childFolder2);

        // 자식 폴더 조회
        const result = await sut.execute(parentFolder.id);

        // 각 자식 폴더의 경로 확인
        expect(result.map((folder) => folder.path)).toContain(`${parentFolder.path}/${childFolder1.name.value}`);
        expect(result.map((folder) => folder.path)).toContain(`${parentFolder.path}/${childFolder2.name.value}`);
      });
    });

    describe('다단계 경로 구조에서', () => {
      it('중간 폴더의 자식 폴더들이 정확한 경로를 가진다', async () => {
        // 3단계 폴더 구조 생성: root/middle/leaf
        const rootFolder = MemoFolder.create('root', null);
        await memoFolderRepository.save(rootFolder);

        const middleFolder = MemoFolder.create('middle', rootFolder.id);
        middleFolder.updatePath(`${rootFolder.path}/${middleFolder.name.value}`);
        await memoFolderRepository.save(middleFolder);

        // middle 폴더의 자식들
        const leafFolder1 = MemoFolder.create('leaf1', middleFolder.id);
        leafFolder1.updatePath(`${middleFolder.path}/${leafFolder1.name.value}`);
        await memoFolderRepository.save(leafFolder1);

        const leafFolder2 = MemoFolder.create('leaf2', middleFolder.id);
        leafFolder2.updatePath(`${middleFolder.path}/${leafFolder2.name.value}`);
        await memoFolderRepository.save(leafFolder2);

        // middle 폴더의 자식 폴더들 조회
        const result = await sut.execute(middleFolder.id);

        // 경로 확인
        const expectedPaths = [
          `${rootFolder.path}/${middleFolder.name.value}/${leafFolder1.name.value}`,
          `${rootFolder.path}/${middleFolder.name.value}/${leafFolder2.name.value}`,
        ];

        expect(result).toHaveLength(2);
        for (const folder of result) {
          expect(expectedPaths).toContain(folder.path);
        }
      });
    });

    describe('최상위 폴더의 자식 폴더 조회 시', () => {
      it('자식 폴더의 경로가 정확하게 반환된다', async () => {
        // 최상위 폴더 생성
        const rootFolder = MemoFolder.create('root', null);
        await memoFolderRepository.save(rootFolder);

        // 최상위 폴더의 직접적인 자식들
        const childFolder1 = MemoFolder.create('child1', rootFolder.id);
        childFolder1.updatePath(`${rootFolder.path}/${childFolder1.name.value}`);
        await memoFolderRepository.save(childFolder1);

        const childFolder2 = MemoFolder.create('child2', rootFolder.id);
        childFolder2.updatePath(`${rootFolder.path}/${childFolder2.name.value}`);
        await memoFolderRepository.save(childFolder2);

        // 최상위 폴더의 자식들 조회
        const result = await sut.execute(rootFolder.id);

        // 경로 확인 (rootName/childName 형식)
        expect(result.map((folder) => folder.path)).toContain(`${rootFolder.path}/${childFolder1.name.value}`);
        expect(result.map((folder) => folder.path)).toContain(`${rootFolder.path}/${childFolder2.name.value}`);
      });
    });
  });
});

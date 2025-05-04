import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { PrismaMemoFolderRepository } from '@/infra/persistence/repository/prisma-memo-folder.repository';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/memo-folder.repository';
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

    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  afterAll(async () => {
    await prisma.memo.deleteMany();
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

      expect(result[0].id).toEqual(rootFolder1.id);
      expect(result[0].name.value).toEqual(rootFolder1.name.value);
      expect(result[0].path).toEqual(`/${rootFolder1.name.value}`);

      expect(result[1].id).toEqual(rootFolder2.id);
      expect(result[1].name.value).toEqual(rootFolder2.name.value);
      expect(result[1].path).toEqual(`/${rootFolder2.name.value}`);
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
    });
  });
});

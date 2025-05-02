import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository';
import { PrismaMemoRepository } from '@/memo/domain/memo/repository/prisma-memo.repository';
import { FindFolderMemosService } from '@/memo/service/memo/find-folder-memos.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Test } from '@nestjs/testing';

describe(FindFolderMemosService.name, () => {
  let prisma: PrismaService;
  let sut: FindFolderMemosService;
  let memoRepository: MemoRepository;
  let memoFolderRepository: MemoFolderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        MemoFolderValidator,
        MemoValidator,
        {
          provide: MEMO_FOLDER_REPOSITORY,
          useClass: PrismaMemoFolderRepository,
        },
        {
          provide: MEMO_REPOSITORY,
          useClass: PrismaMemoRepository,
        },
        FindFolderMemosService,
      ],
    }).compile();

    sut = module.get<FindFolderMemosService>(FindFolderMemosService);
    prisma = module.get<PrismaService>(PrismaService);
    memoRepository = module.get<MemoRepository>(MEMO_REPOSITORY);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);

    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  describe('존재하지 않는 메모 폴더의 메모 목록을 조회할 때', () => {
    it('에러가 발생한다', async () => {
      await expect(sut.execute('non-existent-id')).rejects.toThrow(MemoFolderNotFoundException);
    });
  });

  describe('메모 폴더가 존재하고 메모가 있을 때', () => {
    it('해당 폴더의 메모 목록을 반환한다', async () => {
      const memoFolder = MemoFolder.create('test-folder', null);
      await memoFolderRepository.save(memoFolder);

      const memo1 = Memo.create('Memo 1', 'memo-1', 'Content 1', memoFolder.id, memoFolder.path);
      const memo2 = Memo.create('Memo 2', 'memo-2', 'Content 2', memoFolder.id, memoFolder.path);
      await memoRepository.save(memo1);
      await memoRepository.save(memo2);

      const memos = await sut.execute(memoFolder.id);

      expect(memos).toHaveLength(2);
      expect(memos[0].name.value).toBe(memo1.name.value);
      expect(memos[1].name.value).toBe(memo2.name.value);
      expect(memos[0].folderId).toBe(memoFolder.id);
      expect(memos[1].folderId).toBe(memoFolder.id);
    });
  });

  describe('메모 폴더가 존재하지만 메모가 없을 때', () => {
    it('빈 배열을 반환한다', async () => {
      const memoFolder = MemoFolder.create('empty-folder', null);
      await memoFolderRepository.save(memoFolder);

      const memos = await sut.execute(memoFolder.id);

      expect(memos).toHaveLength(0);
      expect(memos).toEqual([]);
    });
  });

  describe('삭제된 메모는 조회하지 않아야 할 때', () => {
    it('삭제되지 않은 메모만 반환한다', async () => {
      const memoFolder = MemoFolder.create('folder-with-deleted', null);
      await memoFolderRepository.save(memoFolder);

      const memo1 = Memo.create('Active Memo', 'active-memo', 'Active Content', memoFolder.id, memoFolder.path);
      const memo2 = Memo.create('Deleted Memo', 'deleted-memo', 'Deleted Content', memoFolder.id, memoFolder.path);
      memo2.delete();
      await memoRepository.save(memo1);
      await memoRepository.save(memo2);

      const memos = await sut.execute(memoFolder.id);

      expect(memos).toHaveLength(1);
      expect(memos[0].name.value).toBe(memo1.name.value);
      expect(memos[0].deletedAt).toBeNull();
    });
  });
});

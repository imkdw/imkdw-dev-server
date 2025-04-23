import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/core/database/prisma.service';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { FindMemoFolderService } from '@/memo/service/memo-folder/find-memo-folder.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Test } from '@nestjs/testing';

describe(FindMemoFolderService.name, () => {
  let prisma: PrismaService;
  let sut: FindMemoFolderService;
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
        FindMemoFolderService,
      ],
    }).compile();

    sut = module.get<FindMemoFolderService>(FindMemoFolderService);
    prisma = module.get<PrismaService>(PrismaService);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);

    await prisma.memoFolder.deleteMany();
  });

  describe('존재하지 않는 메모 폴더를 조회할 때', () => {
    it('에러가 발생한다', async () => {
      await expect(sut.execute('non-existent-id')).rejects.toThrow(MemoFolderNotFoundException);
    });
  });

  describe('메모 폴더가 존재할 때', () => {
    const memoFolder = MemoFolder.create('test', null);
    it('정보를 반환한다', async () => {
      await memoFolderRepository.save(memoFolder);

      const found = await sut.execute(memoFolder.id);

      expect(found.id).toBe(memoFolder.id);
      expect(found.name.value).toBe(memoFolder.name.value);
      expect(found.parentId).toBe(memoFolder.parentId);
      expect(found.path).toBe(memoFolder.path);
    });
  });
});

import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { PrismaMemoFolderRepository } from '@/infra/persistence/repository/prisma-memo-folder.repository';
import { PrismaMemoRepository } from '@/infra/persistence/repository/prisma-memo.repository';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/memo-folder.repository';
import { MemoNotFoundException } from '@/memo/domain/memo/exception/memo-not-found.exception';
import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/memo.repository';
import { DeleteMemoService } from '@/memo/service/memo/delete-memo.service';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Test } from '@nestjs/testing';

describe(DeleteMemoService.name, () => {
  let prisma: PrismaService;
  let sut: DeleteMemoService;
  let memoRepository: MemoRepository;
  let memoFolderRepository: MemoFolderRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        MemoValidator,
        {
          provide: MEMO_FOLDER_REPOSITORY,
          useClass: PrismaMemoFolderRepository,
        },
        {
          provide: MEMO_REPOSITORY,
          useClass: PrismaMemoRepository,
        },
        DeleteMemoService,
      ],
    }).compile();

    sut = module.get<DeleteMemoService>(DeleteMemoService);
    prisma = module.get<PrismaService>(PrismaService);
    memoRepository = module.get<MemoRepository>(MEMO_REPOSITORY);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);

    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  afterAll(async () => {
    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  describe('존재하지 않는 슬러그로 메모 삭제를 시도하는 경우', () => {
    it('에러가 발생한다', async () => {
      await expect(sut.execute('non-existent-slug')).rejects.toThrow(MemoNotFoundException);
    });
  });

  describe('존재하는 슬러그로 메모 삭제를 시도하는 경우', () => {
    const memoFolder = MemoFolder.create('테스트 폴더', null);
    const memo = Memo.create('테스트 메모', 'test-slug', '메모 내용', memoFolder.id, memoFolder.path);

    it('메모가 삭제된다', async () => {
      await memoFolderRepository.save(memoFolder);

      await memoRepository.save(memo);

      await sut.execute(memo.slug);

      const deletedMemo = await memoRepository.findBySlug(memo.slug);
      expect(deletedMemo).toBeNull();
    });
  });
});

import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/core/database/prisma.service';
import { MemoNotFoundException } from '@/memo/domain/memo/exception/memo-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository';
import { PrismaMemoRepository } from '@/memo/domain/memo/repository/prisma-memo.repository';
import { GetMemoService } from '@/memo/service/memo/get-memo.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Test } from '@nestjs/testing';

describe(GetMemoService.name, () => {
  let prisma: PrismaService;
  let sut: GetMemoService;
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
        GetMemoService,
      ],
    }).compile();

    sut = module.get<GetMemoService>(GetMemoService);
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

  describe('존재하지 않는 메모를 slug로 조회할 때', () => {
    it('에러가 발생한다', async () => {
      await expect(sut.execute('non-existent-slug')).rejects.toThrow(MemoNotFoundException);
    });
  });

  describe('존재하는 메모를 slug로 조회할 때', () => {
    it('메모 상세 정보를 반환한다', async () => {
      // 폴더 생성
      const memoFolder = MemoFolder.create('test-folder', null);
      await memoFolderRepository.save(memoFolder);

      // 메모 생성
      const memo = Memo.create('Test Memo', 'test-memo', 'Test Content', memoFolder.id, memoFolder.path);
      await memoRepository.save(memo);

      // 테스트 대상 실행
      const foundMemo = await sut.execute('test-memo');

      // 검증
      expect(foundMemo).toBeDefined();
      expect(foundMemo.id).toBe(memo.id);
      expect(foundMemo.name).toBe('Test Memo');
      expect(foundMemo.slug).toBe('test-memo');
      expect(foundMemo.content).toBe('Test Content');
      expect(foundMemo.folderId).toBe(memoFolder.id);
      expect(foundMemo.path).toBe(memoFolder.path);
    });
  });

  describe('삭제된 메모를 slug로 조회할 때', () => {
    it('에러가 발생한다', async () => {
      // 폴더 생성
      const memoFolder = MemoFolder.create('test-folder', null);
      await memoFolderRepository.save(memoFolder);

      // 메모 생성 및 삭제 처리
      const memo = Memo.create('Deleted Memo', 'deleted-memo', 'Deleted Content', memoFolder.id, memoFolder.path);
      memo.delete(); // 메모 삭제 처리
      await memoRepository.save(memo);

      // 테스트 대상 실행 및 검증
      await expect(sut.execute('deleted-memo')).rejects.toThrow(MemoNotFoundException);
    });
  });
});

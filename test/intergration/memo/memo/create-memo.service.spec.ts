import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { TRANSLATION_SERVICE, TranslationTargetLanguage } from '@/infra/translation/translation.enum';
import { TranslationService } from '@/infra/translation/translation.service';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { DuplicateMemoNameException } from '@/memo/domain/memo/exception/duplicate-memo-name.exception';
import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository';
import { PrismaMemoRepository } from '@/memo/domain/memo/repository/prisma-memo.repository';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';
import { CreateMemoService } from '@/memo/service/memo/create-memo.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Test } from '@nestjs/testing';
import { validate } from 'uuid';

describe(CreateMemoService.name, () => {
  let prisma: PrismaService;
  let sut: CreateMemoService;
  let memoRepository: MemoRepository;
  let memoFolderRepository: MemoFolderRepository;

  const translationServiceMock: jest.Mocked<TranslationService> = {
    translate: jest.fn().mockResolvedValue('test-slug'),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        MemoFolderValidator,
        MemoValidator,
        MemoHelper,
        {
          provide: MEMO_FOLDER_REPOSITORY,
          useClass: PrismaMemoFolderRepository,
        },
        {
          provide: MEMO_REPOSITORY,
          useClass: PrismaMemoRepository,
        },
        {
          provide: TRANSLATION_SERVICE,
          useValue: translationServiceMock,
        },
        CreateMemoService,
      ],
    }).compile();

    sut = module.get<CreateMemoService>(CreateMemoService);
    prisma = module.get<PrismaService>(PrismaService);
    memoRepository = module.get<MemoRepository>(MEMO_REPOSITORY);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);

    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  describe('존재하지 않는 폴더에 메모를 생성하는 경우', () => {
    it('에러가 발생한다', async () => {
      await expect(
        sut.execute({
          name: '테스트 메모',
          content: '메모 내용',
          folderId: 'non-existent-folder-id',
          path: '/non-existent',
        }),
      ).rejects.toThrow(MemoFolderNotFoundException);
    });
  });

  describe('메모의 제목이 중복되는 경우', () => {
    const memoFolder = MemoFolder.create('테스트 폴더', null);
    const existingMemo = Memo.create('테스트 메모', 'test-slug', '메모 내용', memoFolder.id, memoFolder.path);

    it('에러가 발생한다', async () => {
      await memoFolderRepository.save(memoFolder);
      await memoRepository.save(existingMemo);

      await expect(
        sut.execute({
          name: existingMemo.name.value,
          content: '메모 내용',
          folderId: memoFolder.id,
          path: memoFolder.path,
        }),
      ).rejects.toThrow(DuplicateMemoNameException);
    });
  });

  describe('존재하는 폴더에 메모를 생성하면', () => {
    const memoFolder = MemoFolder.create('test-folder', null);

    it('메모를 반환한다', async () => {
      await memoFolderRepository.save(memoFolder);

      const result = await sut.execute({
        name: 'test-memo',
        content: 'test-content',
        folderId: memoFolder.id,
        path: memoFolder.path,
      });

      // 생성된 메모 검증
      expect(validate(result.id)).toBeTruthy();
      expect(result.name.value).toBe('test-memo');
      expect(result.content).toBe('test-content');
      expect(result.folderId).toBe(memoFolder.id);
      expect(result.path).toBe(`${memoFolder.path}/test-memo`);

      // 메모 slug 생성을 위한 번역서비스 호출여부 검증
      expect(translationServiceMock.translate).toHaveBeenCalledWith('test-memo', TranslationTargetLanguage.EN);
    });
  });
});

import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/core/database/prisma.service';
import { TRANSLATION_SERVICE } from '@/infra/translation/translation.enum';
import { TranslationService } from '@/infra/translation/translation.service';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { DuplicateMemoNameException } from '@/memo/domain/memo/exception/duplicate-memo-name.exception';
import { MemoNotFoundException } from '@/memo/domain/memo/exception/memo-not-found.exception';
import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository';
import { PrismaMemoRepository } from '@/memo/domain/memo/repository/prisma-memo.repository';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';
import { UpdateMemoService } from '@/memo/service/memo/update-memo.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Test } from '@nestjs/testing';

describe(UpdateMemoService.name, () => {
  let prisma: PrismaService;
  let sut: UpdateMemoService;
  let memoRepository: MemoRepository;
  let memoFolderRepository: MemoFolderRepository;

  const translationServiceMock: jest.Mocked<TranslationService> = {
    translate: jest.fn().mockResolvedValue('new-slug'),
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
        UpdateMemoService,
      ],
    }).compile();

    sut = module.get<UpdateMemoService>(UpdateMemoService);
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

  describe('존재하지 않는 메모를 업데이트하는 경우', () => {
    it('에러가 발생한다', async () => {
      await expect(
        sut.execute('non-existent-slug', {
          name: '새 메모 제목',
          content: '새 메모 내용',
          folderId: 'folder-id',
        }),
      ).rejects.toThrow(MemoNotFoundException);
    });
  });

  describe('메모의 이름이 중복되는 경우', () => {
    const memoFolder = MemoFolder.create('테스트 폴더', null);
    const existingMemo = Memo.create('기존 메모', 'existing-memo', '메모 내용', memoFolder.id, memoFolder.path);
    const targetMemo = Memo.create('대상 메모', 'target-memo', '메모 내용', memoFolder.id, memoFolder.path);

    it('에러가 발생한다', async () => {
      await memoFolderRepository.save(memoFolder);
      await memoRepository.save(existingMemo);
      await memoRepository.save(targetMemo);

      await expect(
        sut.execute(targetMemo.slug, {
          name: existingMemo.name.value,
          content: targetMemo.content,
          folderId: memoFolder.id,
        }),
      ).rejects.toThrow(DuplicateMemoNameException);
    });
  });

  describe('메모의 이름이 변경되는 경우', () => {
    const memoFolder = MemoFolder.create('테스트 폴더', null);
    const memo = Memo.create('테스트 메모', 'test-memo', '메모 내용', memoFolder.id, memoFolder.path);

    it('메모를 업데이트한다', async () => {
      await memoFolderRepository.save(memoFolder);
      await memoRepository.save(memo);

      const newName = '새 메모 제목';
      const updatedMemo = await sut.execute(memo.slug, {
        name: newName,
        content: memo.content,
        folderId: memoFolder.id,
      });

      expect(updatedMemo.name.value).toBe(newName);
      expect(updatedMemo.path).toBe(`${memoFolder.path}/${newName}`);
      expect(translationServiceMock.translate).toHaveBeenCalled();
    });
  });

  describe('다른 폴더로 메모를 이동하면', () => {
    const memoFolder = MemoFolder.create('테스트 폴더', null);
    const memo = Memo.create('테스트 메모', 'test-memo', '메모 내용', memoFolder.id, memoFolder.path);

    it('메모의 경로가 변경된다', async () => {
      await memoFolderRepository.save(memoFolder);
      await memoRepository.save(memo);

      const newMemoFolder = MemoFolder.create('새 테스트 폴더', null);
      await memoFolderRepository.save(newMemoFolder);

      const updatedMemo = await sut.execute(memo.slug, {
        name: memo.name.value,
        content: memo.content,
        folderId: newMemoFolder.id,
      });

      expect(updatedMemo.folderId).toBe(newMemoFolder.id);
      expect(updatedMemo.path).toBe(`${newMemoFolder.path}/${memo.name.value}`);
      expect(translationServiceMock.translate).not.toHaveBeenCalled();
    });
  });
});

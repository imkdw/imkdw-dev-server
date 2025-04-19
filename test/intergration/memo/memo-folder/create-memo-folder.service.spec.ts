import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/core/database/prisma.service';
import { DuplicateMemoFolderNameException } from '@/memo/domain/memo-folder/exception/duplicate-memo-folder-name.exception';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { RequestCreateMemoFolderDto } from '@/memo/dto/memo-folder/create-memo-folder.dto';
import { CreateMemoFolderService } from '@/memo/service/memo-folder/create-memo-folder.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Test } from '@nestjs/testing';

describe(CreateMemoFolderService.name, () => {
  let prisma: PrismaService;
  let sut: CreateMemoFolderService;
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
        CreateMemoFolderService,
      ],
    }).compile();

    sut = module.get<CreateMemoFolderService>(CreateMemoFolderService);
    prisma = module.get<PrismaService>(PrismaService);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);

    await prisma.memoFolder.deleteMany();
  });

  describe('기존 폴더명과 중복되는 경우', () => {
    const existMemoFolder = MemoFolder.create('test', null);
    it('에러가 발생한다', async () => {
      await memoFolderRepository.save(existMemoFolder);

      await expect(
        sut.execute({
          name: existMemoFolder.name.value,
          parentId: null,
        }),
      ).rejects.toThrow(DuplicateMemoFolderNameException);
    });
  });

  describe('부모 메모 폴더가 없는경우', () => {
    it('에러가 발생한다', async () => {
      await expect(sut.execute({ name: 'test', parentId: '1' })).rejects.toThrow(MemoFolderNotFoundException);
    });
  });

  describe('부모 폴더가 주어지고', () => {
    const parentMemoFolder = MemoFolder.create('parent', null);
    describe('폴더를 생성하면', () => {
      const memoFolderName = 'test';
      it(' 생성된 폴더를 반환한다', async () => {
        await memoFolderRepository.save(parentMemoFolder);

        const createdMemoFolder = await sut.execute({
          name: memoFolderName,
          parentId: parentMemoFolder.id,
        });

        expect(createdMemoFolder.id).toBeTruthy();
        expect(createdMemoFolder.name.value).toBe(memoFolderName);
        expect(createdMemoFolder.parentId).toBe(parentMemoFolder.id);
        expect(createdMemoFolder.path).toBe(`${parentMemoFolder.path}/${memoFolderName}`);
      });
    });
  });
});

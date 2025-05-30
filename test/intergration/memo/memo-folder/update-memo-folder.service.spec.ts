import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { PrismaMemoFolderRepository } from '@/infra/persistence/repository/prisma-memo-folder.repository';
import { DuplicateMemoFolderNameException } from '@/memo/domain/memo-folder/exception/duplicate-memo-folder-name.exception';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/memo-folder.repository';
import { RequestUpdateMemoFolderDto } from '@/memo/dto/memo-folder/update-memo-folder.dto';
import { UpdateMemoFolderService } from '@/memo/service/memo-folder/update-memo-folder.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Test } from '@nestjs/testing';

describe(UpdateMemoFolderService.name, () => {
  let prisma: PrismaService;
  let sut: UpdateMemoFolderService;
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
        UpdateMemoFolderService,
      ],
    }).compile();

    sut = module.get<UpdateMemoFolderService>(UpdateMemoFolderService);
    prisma = module.get<PrismaService>(PrismaService);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);

    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  afterAll(async () => {
    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  describe('존재하지 않는 메모 폴더를 수정하는 경우', () => {
    it('에러가 발생한다', async () => {
      const updateDto: RequestUpdateMemoFolderDto = {
        name: '수정된 폴더명',
        parentId: null,
      };

      await expect(sut.execute('존재하지 않는 ID', updateDto)).rejects.toThrow(MemoFolderNotFoundException);
    });
  });

  describe('이름을 변경할 때', () => {
    describe('같은 부모 폴더 내에 동일한 이름이 이미 존재하는 경우', () => {
      it('에러가 발생한다', async () => {
        const folder1 = MemoFolder.create('폴더1', null);
        const folder2 = MemoFolder.create('폴더2', null);

        await memoFolderRepository.save(folder1);
        await memoFolderRepository.save(folder2);

        const updateDto: RequestUpdateMemoFolderDto = {
          name: folder1.name.value,
          parentId: null,
        };

        await expect(sut.execute(folder2.id, updateDto)).rejects.toThrow(DuplicateMemoFolderNameException);
      });
    });

    describe('유효한 새 이름으로 변경하는 경우', () => {
      it('이름이 업데이트된다', async () => {
        const folder = MemoFolder.create('원래 폴더명', null);
        await memoFolderRepository.save(folder);

        const newName = '새 폴더명';
        const updateDto: RequestUpdateMemoFolderDto = {
          name: newName,
          parentId: null,
        };

        const updatedFolder = await sut.execute(folder.id, updateDto);

        expect(updatedFolder.name.value).toBe(newName);
      });
    });
  });

  describe('부모 폴더를 변경할 때', () => {
    describe('존재하지 않는 부모 폴더로 변경하는 경우', () => {
      it('에러가 발생한다', async () => {
        const folder = MemoFolder.create('폴더', null);
        await memoFolderRepository.save(folder);

        const updateDto: RequestUpdateMemoFolderDto = {
          name: folder.name.value,
          parentId: '존재하지 않는 ID',
        };

        await expect(sut.execute(folder.id, updateDto)).rejects.toThrow(MemoFolderNotFoundException);
      });
    });

    describe('새로운 부모 폴더로 변경하는 경우', () => {
      it('부모 폴더가 변경된다', async () => {
        const rootFolder = MemoFolder.create('루트 폴더', null);
        const childFolder = MemoFolder.create('자식 폴더', null);

        await memoFolderRepository.save(rootFolder);
        await memoFolderRepository.save(childFolder);

        const updateDto: RequestUpdateMemoFolderDto = {
          name: childFolder.name.value,
          parentId: rootFolder.id,
        };

        const updatedFolder = await sut.execute(childFolder.id, updateDto);

        expect(updatedFolder.parentId).toBe(rootFolder.id);
      });
    });

    describe('부모 폴더를 null로 변경하는 경우', () => {
      it('최상위 폴더로 변경된다', async () => {
        const parentFolder = MemoFolder.create('부모 폴더', null);
        await memoFolderRepository.save(parentFolder);

        const childFolder = MemoFolder.create('자식 폴더', parentFolder.id);
        await memoFolderRepository.save(childFolder);

        const updateDto: RequestUpdateMemoFolderDto = {
          name: childFolder.name.value,
          parentId: null,
        };

        const updatedFolder = await sut.execute(childFolder.id, updateDto);

        expect(updatedFolder.parentId).toBeNull();
      });
    });
  });
});

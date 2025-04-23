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

  describe('자식 폴더가 있는 부모 폴더를 조회할 때', () => {
    const parentFolder = MemoFolder.create('parent', null);
    it('자식 폴더 목록을 반환한다', async () => {
      await memoFolderRepository.save(parentFolder);

      // 자식 폴더 생성
      const childFolder1 = MemoFolder.create('child1', parentFolder.id, parentFolder.path);
      const childFolder2 = MemoFolder.create('child2', parentFolder.id, parentFolder.path);
      await memoFolderRepository.save(childFolder1);
      await memoFolderRepository.save(childFolder2);

      // 부모 폴더의 자식 폴더가 아닌 다른 폴더 생성
      const anotherParentFolder = MemoFolder.create('another-parent', null);
      const anotherChildFolder = MemoFolder.create('another-child', anotherParentFolder.id);
      await memoFolderRepository.save(anotherParentFolder);
      await memoFolderRepository.save(anotherChildFolder);

      const result = await sut.execute(parentFolder.id);

      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual(childFolder1.id);
      expect(result[1].id).toEqual(childFolder2.id);
      expect(result[0].name.value).toEqual(childFolder1.name.value);
      expect(result[1].name.value).toEqual(childFolder2.name.value);
      expect(result[0].path).toEqual(`${parentFolder.path}/${childFolder1.name.value}`);
      expect(result[1].path).toEqual(`${parentFolder.path}/${childFolder2.name.value}`);
    });
  });
});

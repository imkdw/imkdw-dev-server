import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/memo-folder.repository';
import { PrismaMemoFolderRepository } from '@/infra/persistence/repository/prisma-memo-folder.repository';
import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository/memo.repository';
import { PrismaMemoRepository } from '@/infra/persistence/repository/prisma-memo.repository';
import { DeleteMemoFolderService } from '@/memo/service/memo-folder/delete-memo-folder.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Test } from '@nestjs/testing';

describe(DeleteMemoFolderService.name, () => {
  let prisma: PrismaService;
  let sut: DeleteMemoFolderService;
  let memoFolderRepository: MemoFolderRepository;
  let memoRepository: MemoRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        MemoFolderValidator,
        {
          provide: MEMO_FOLDER_REPOSITORY,
          useClass: PrismaMemoFolderRepository,
        },
        {
          provide: MEMO_REPOSITORY,
          useClass: PrismaMemoRepository,
        },
        DeleteMemoFolderService,
      ],
    }).compile();

    sut = module.get<DeleteMemoFolderService>(DeleteMemoFolderService);
    prisma = module.get<PrismaService>(PrismaService);
    memoFolderRepository = module.get<MemoFolderRepository>(MEMO_FOLDER_REPOSITORY);
    memoRepository = module.get<MemoRepository>(MEMO_REPOSITORY);

    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  afterAll(async () => {
    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  describe('존재하지 않는 메모 폴더를 삭제하려고 할 때', () => {
    it('에러가 발생한다', async () => {
      await expect(sut.execute('non-existent-id')).rejects.toThrow(MemoFolderNotFoundException);
    });
  });

  describe('자식 폴더가 없는 메모 폴더를 삭제할 때', () => {
    it('메모 폴더가 삭제된다', async () => {
      // 메모 폴더 생성
      const memoFolder = MemoFolder.create('test', null);
      await memoFolderRepository.save(memoFolder);

      // 메모 폴더 삭제
      await sut.execute(memoFolder.id);

      // 삭제 확인
      const deletedFolder = await prisma.memoFolder.findUnique({
        where: { id: memoFolder.id },
      });

      expect(deletedFolder).not.toBeNull();
      expect(deletedFolder?.deletedAt).not.toBeNull();
    });
  });

  describe('자식 폴더가 있는 메모 폴더를 삭제할 때', () => {
    it('메모 폴더와 모든 자식 폴더가 삭제된다', async () => {
      // 부모 폴더 생성
      const parentFolder = MemoFolder.create('parent', null);
      await memoFolderRepository.save(parentFolder);

      // 자식 폴더 생성
      const childFolder1 = MemoFolder.create('child1', parentFolder.id, parentFolder.path);
      await memoFolderRepository.save(childFolder1);

      const childFolder2 = MemoFolder.create('child2', parentFolder.id, parentFolder.path);
      await memoFolderRepository.save(childFolder2);

      // 메모 폴더 삭제
      await sut.execute(parentFolder.id);

      // 삭제 확인
      const deletedParent = await prisma.memoFolder.findUnique({
        where: { id: parentFolder.id },
      });
      const deletedChild1 = await prisma.memoFolder.findUnique({
        where: { id: childFolder1.id },
      });
      const deletedChild2 = await prisma.memoFolder.findUnique({
        where: { id: childFolder2.id },
      });

      expect(deletedParent).not.toBeNull();
      expect(deletedParent?.deletedAt).not.toBeNull();
      expect(deletedChild1).not.toBeNull();
      expect(deletedChild1?.deletedAt).not.toBeNull();
      expect(deletedChild2).not.toBeNull();
      expect(deletedChild2?.deletedAt).not.toBeNull();
    });
  });

  describe('다단계 폴더 구조에서 삭제할 때', () => {
    it('해당 폴더와 모든 하위 폴더가 삭제된다', async () => {
      // 3단계 폴더 구조 생성: root -> middle -> leaf
      const rootFolder = MemoFolder.create('root', null);
      await memoFolderRepository.save(rootFolder);

      const middleFolder = MemoFolder.create('middle', rootFolder.id, rootFolder.path);
      await memoFolderRepository.save(middleFolder);

      const leafFolder = MemoFolder.create('leaf', middleFolder.id, middleFolder.path);
      await memoFolderRepository.save(leafFolder);

      // 중간 폴더를 삭제하면 리프 폴더도 함께 삭제되어야 함
      await sut.execute(middleFolder.id);

      // 삭제 확인
      const deletedMiddle = await prisma.memoFolder.findUnique({
        where: { id: middleFolder.id },
      });
      const deletedLeaf = await prisma.memoFolder.findUnique({
        where: { id: leafFolder.id },
      });
      const root = await prisma.memoFolder.findUnique({
        where: { id: rootFolder.id },
      });

      expect(deletedMiddle).not.toBeNull();
      expect(deletedMiddle?.deletedAt).not.toBeNull();
      expect(deletedLeaf).not.toBeNull();
      expect(deletedLeaf?.deletedAt).not.toBeNull();
      // 루트 폴더는 삭제되지 않아야 함
      expect(root?.deletedAt).toBeNull();
    });
  });

  it('메모 폴더 삭제 시 메모도 삭제되어야 한다', async () => {
    // 폴더 생성x
    const folder = MemoFolder.create('test-folder', null);
    await memoFolderRepository.save(folder);

    const childFolder = MemoFolder.create('child-folder', folder.id, folder.path);
    await memoFolderRepository.save(childFolder);

    const memo1 = Memo.create('test-memo-1', 'test-slug-1', 'test content 1', folder.id, folder.path);
    await memoRepository.save(memo1);

    const memo2 = Memo.create('test-memo-2', 'test-slug-2', 'test content 2', childFolder.id, childFolder.path);
    await memoRepository.save(memo2);

    await sut.execute(folder.id);

    const deletedMemo1 = await memoRepository.findById(memo1.id);
    const deletedMemo2 = await memoRepository.findById(memo2.id);

    expect(deletedMemo1).toBeNull();
    expect(deletedMemo2).toBeNull();
  });
});

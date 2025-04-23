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
    });

    it('경로 정보를 포함하여 반환한다', async () => {
      await memoFolderRepository.save(memoFolder);

      const found = await sut.execute(memoFolder.id);

      expect(found.path).toBe(memoFolder.name.value);
    });
  });

  describe('경로 정보 조회 테스트', () => {
    describe('최상위 폴더 조회 시', () => {
      it('경로가 폴더명과 동일하다', async () => {
        const rootFolder = MemoFolder.create('root', null);
        await memoFolderRepository.save(rootFolder);

        const found = await sut.execute(rootFolder.id);

        expect(found.path).toBe(rootFolder.name.value);
      });
    });

    describe('하위 폴더 조회 시', () => {
      it('전체 경로가 정확히 반환된다', async () => {
        // 폴더 구조 생성: root/parent/child
        const rootFolder = MemoFolder.create('root', null);
        await memoFolderRepository.save(rootFolder);

        const parentFolder = MemoFolder.create('parent', rootFolder.id);
        parentFolder.updatePath(`${rootFolder.path}/${parentFolder.name.value}`);
        await memoFolderRepository.save(parentFolder);

        const childFolder = MemoFolder.create('child', parentFolder.id);
        childFolder.updatePath(`${parentFolder.path}/${childFolder.name.value}`);
        await memoFolderRepository.save(childFolder);

        // 각 폴더 조회 및 경로 확인
        const foundRoot = await sut.execute(rootFolder.id);
        const foundParent = await sut.execute(parentFolder.id);
        const foundChild = await sut.execute(childFolder.id);

        expect(foundRoot.path).toBe('root');
        expect(foundParent.path).toBe('root/parent');
        expect(foundChild.path).toBe('root/parent/child');
      });
    });

    describe('복잡한 구조에서 폴더 조회 시', () => {
      it('각 폴더의 전체 경로가 정확히 반환된다', async () => {
        // 여러 분기를 가진 폴더 구조 생성
        const root = MemoFolder.create('root', null);
        await memoFolderRepository.save(root);

        // 첫 번째 분기
        const branch1 = MemoFolder.create('branch1', root.id);
        branch1.updatePath(`${root.path}/${branch1.name.value}`);
        await memoFolderRepository.save(branch1);

        const leaf1 = MemoFolder.create('leaf1', branch1.id);
        leaf1.updatePath(`${branch1.path}/${leaf1.name.value}`);
        await memoFolderRepository.save(leaf1);

        // 두 번째 분기
        const branch2 = MemoFolder.create('branch2', root.id);
        branch2.updatePath(`${root.path}/${branch2.name.value}`);
        await memoFolderRepository.save(branch2);

        const leaf2 = MemoFolder.create('leaf2', branch2.id);
        leaf2.updatePath(`${branch2.path}/${leaf2.name.value}`);
        await memoFolderRepository.save(leaf2);

        // 각 폴더 조회 및 경로 확인
        const foundLeaf1 = await sut.execute(leaf1.id);
        const foundLeaf2 = await sut.execute(leaf2.id);

        expect(foundLeaf1.path).toBe('root/branch1/leaf1');
        expect(foundLeaf2.path).toBe('root/branch2/leaf2');
      });
    });
  });
});

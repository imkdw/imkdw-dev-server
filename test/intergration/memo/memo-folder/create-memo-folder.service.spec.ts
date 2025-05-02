import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { DuplicateMemoFolderNameException } from '@/memo/domain/memo-folder/exception/duplicate-memo-folder-name.exception';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/memo-folder.repository';
import { PrismaMemoFolderRepository } from '@/infra/persistence/repository/prisma-memo-folder.repository';
import { CreateMemoFolderService } from '@/memo/service/memo-folder/create-memo-folder.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Test } from '@nestjs/testing';
import { validate } from 'uuid';

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

    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  afterAll(async () => {
    await prisma.memo.deleteMany();
    await prisma.memoFolder.deleteMany();
  });

  describe('기존 폴더명과 중복되는 경우', () => {
    const existFolderName = 'test';
    it('에러가 발생한다', async () => {
      const existMemoFolder = MemoFolder.create(existFolderName, null);
      await memoFolderRepository.save(existMemoFolder);

      await expect(
        sut.execute({
          name: existFolderName,
          parentId: null,
        }),
      ).rejects.toThrow(DuplicateMemoFolderNameException);
    });
  });

  describe('부모 메모 폴더가 없는경우', () => {
    it('에러가 발생한다', async () => {
      await expect(sut.execute({ name: 'test', parentId: 'no-parent' })).rejects.toThrow(MemoFolderNotFoundException);
    });
  });

  describe('부모 폴더가 주어지고', () => {
    const parentMemoFolder = MemoFolder.create('parent', null);
    describe('폴더를 생성하면', () => {
      const memoFolderName = 'child';
      it('생성된 폴더를 반환한다', async () => {
        await memoFolderRepository.save(parentMemoFolder);

        const createdMemoFolder = await sut.execute({
          name: memoFolderName,
          parentId: parentMemoFolder.id,
        });

        expect(validate(createdMemoFolder.id)).toBeTruthy();
        expect(createdMemoFolder.name.value).toBe(memoFolderName);
        expect(createdMemoFolder.parentId).toBe(parentMemoFolder.id);
        expect(createdMemoFolder.path).toBe(`${parentMemoFolder.path}/${memoFolderName}`);
      });
    });
  });

  describe('최상위 폴더 생성 시', () => {
    const rootFolderName = 'root-folder';

    it('경로가 폴더명과 동일하게 설정된다', async () => {
      const createdMemoFolder = await sut.execute({
        name: rootFolderName,
        parentId: null,
      });

      expect(createdMemoFolder.path).toBe(`/${rootFolderName}`);
    });
  });

  describe('다단계 폴더 구조에서', () => {
    it('모든 상위 경로가 포함된 경로로 생성된다', async () => {
      // 1단계: 최상위 폴더
      const level1Folder = await sut.execute({
        name: 'level1',
        parentId: null,
      });

      // 2단계: 1단계의 하위 폴더
      const level2Folder = await sut.execute({
        name: 'level2',
        parentId: level1Folder.id,
      });

      // 3단계: 2단계의 하위 폴더
      const level3Folder = await sut.execute({
        name: 'level3',
        parentId: level2Folder.id,
      });

      expect(level1Folder.path).toBe(`/${level1Folder.name.value}`);
      expect(level2Folder.path).toBe(`${level1Folder.path}/${level2Folder.name.value}`);
      expect(level3Folder.path).toBe(`${level2Folder.path}/${level3Folder.name.value}`);
    });
  });
});

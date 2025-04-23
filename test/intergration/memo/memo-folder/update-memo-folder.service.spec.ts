import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { PrismaService } from '@/core/database/prisma.service';
import { DuplicateMemoFolderNameException } from '@/memo/domain/memo-folder/exception/duplicate-memo-folder-name.exception';
import { MemoFolderNotFoundException } from '@/memo/domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
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

  describe('이름과 부모 폴더를 동시에 변경할 때', () => {
    it('이름과 부모가 모두 업데이트된다', async () => {
      const rootFolder1 = MemoFolder.create('루트 폴더1', null);
      const rootFolder2 = MemoFolder.create('루트 폴더2', null);
      const childFolder = MemoFolder.create('자식 폴더', rootFolder1.id);

      await memoFolderRepository.save(rootFolder1);
      await memoFolderRepository.save(rootFolder2);
      await memoFolderRepository.save(childFolder);

      const newName = '새 이름';
      const updateDto: RequestUpdateMemoFolderDto = {
        name: newName,
        parentId: rootFolder2.id,
      };

      const updatedFolder = await sut.execute(childFolder.id, updateDto);

      expect(updatedFolder.name.value).toBe(newName);
      expect(updatedFolder.parentId).toBe(rootFolder2.id);

      // 데이터베이스에 정상적으로 저장되었는지 확인
      const savedFolder = await memoFolderRepository.findById(childFolder.id);
      expect(savedFolder).toBeDefined();
      expect(savedFolder!.name.value).toBe(newName);
      expect(savedFolder!.parentId).toBe(rootFolder2.id);
    });
  });

  describe('경로(path) 업데이트 테스트', () => {
    describe('최상위 폴더로 변경할 때', () => {
      it('경로가 폴더명으로 설정된다', async () => {
        // 부모 폴더와 자식 폴더 생성
        const parentFolder = MemoFolder.create('부모 폴더', null);
        await memoFolderRepository.save(parentFolder);

        const childFolder = MemoFolder.create('자식 폴더', parentFolder.id);
        await memoFolderRepository.save(childFolder);

        // 자식 폴더를 최상위 폴더로 변경
        const updateDto: RequestUpdateMemoFolderDto = {
          name: childFolder.name.value,
          parentId: null,
        };

        const updatedFolder = await sut.execute(childFolder.id, updateDto);

        // 경로가 폴더명으로만 구성되는지 확인
        expect(updatedFolder.path).toBe(childFolder.name.value);
      });
    });

    describe('부모 폴더를 변경할 때', () => {
      it('경로가 새 부모 경로 + 폴더명으로 업데이트된다', async () => {
        // 두 개의 부모 폴더 생성
        const parentFolder1 = MemoFolder.create('부모1', null);
        const parentFolder2 = MemoFolder.create('부모2', null);
        await memoFolderRepository.save(parentFolder1);
        await memoFolderRepository.save(parentFolder2);

        // 첫 번째 부모의 자식 폴더 생성
        const childFolder = MemoFolder.create('자식', parentFolder1.id);
        await memoFolderRepository.save(childFolder);

        // 다른 부모로 이동
        const updateDto: RequestUpdateMemoFolderDto = {
          name: childFolder.name.value,
          parentId: parentFolder2.id,
        };

        const updatedFolder = await sut.execute(childFolder.id, updateDto);

        // 경로가 새 부모 경로 + 폴더명인지 확인
        expect(updatedFolder.path).toBe(`${parentFolder2.path}/${childFolder.name.value}`);
      });
    });

    describe('이름만 변경할 때', () => {
      it('경로의 마지막 부분이 새 이름으로 업데이트된다', async () => {
        // 부모 폴더와 자식 폴더 생성
        const parentFolder = MemoFolder.create('부모', null);
        await memoFolderRepository.save(parentFolder);

        const childFolder = MemoFolder.create('자식', parentFolder.id);
        await memoFolderRepository.save(childFolder);

        const newName = '새이름';
        const updateDto: RequestUpdateMemoFolderDto = {
          name: newName,
          parentId: parentFolder.id,
        };

        const updatedFolder = await sut.execute(childFolder.id, updateDto);

        // 경로의 마지막 부분만 새 이름으로 변경되었는지 확인
        expect(updatedFolder.path).toBe(`${parentFolder.path}/${newName}`);
      });
    });

    describe('이름과 부모 모두 변경할 때', () => {
      it('완전히 새로운 경로로 업데이트된다', async () => {
        // 여러 폴더 구조 설정
        const rootFolder1 = MemoFolder.create('루트1', null);
        const rootFolder2 = MemoFolder.create('루트2', null);
        await memoFolderRepository.save(rootFolder1);
        await memoFolderRepository.save(rootFolder2);

        const subFolder1 = MemoFolder.create('하위1', rootFolder1.id);
        await memoFolderRepository.save(subFolder1);

        const newName = '새폴더';
        const updateDto: RequestUpdateMemoFolderDto = {
          name: newName,
          parentId: rootFolder2.id,
        };

        const updatedFolder = await sut.execute(subFolder1.id, updateDto);

        // 새 부모 경로 + 새 이름으로 완전히 새로운 경로가 생성되었는지 확인
        expect(updatedFolder.path).toBe(`${rootFolder2.path}/${newName}`);
      });
    });

    describe('다단계 경로 구조에서', () => {
      it('하위 폴더의 경로도 함께 업데이트된다', async () => {
        // 3단계 폴더 구조 생성
        const level1 = MemoFolder.create('레벨1', null);
        await memoFolderRepository.save(level1);

        const level2 = MemoFolder.create('레벨2', level1.id);
        await memoFolderRepository.save(level2);

        const level3 = MemoFolder.create('레벨3', level2.id);
        await memoFolderRepository.save(level3);

        // 중간 폴더(level2)의 이름 변경
        const newName = '새레벨2';
        const updateDto: RequestUpdateMemoFolderDto = {
          name: newName,
          parentId: level1.id,
        };

        // 중간 폴더 업데이트
        const updatedLevel2 = await sut.execute(level2.id, updateDto);

        // 업데이트된 폴더의 경로 확인
        expect(updatedLevel2.path).toBe(`${level1.path}/${newName}`);

        // 하위 폴더를 다시 조회하여 경로가 업데이트되었는지 확인
        const updatedLevel3 = await memoFolderRepository.findById(level3.id);
        expect(updatedLevel3).toBeDefined();
        expect(updatedLevel3!.path).toBe(`${updatedLevel2.path}/${level3.name.value}`);
      });
    });
  });
});

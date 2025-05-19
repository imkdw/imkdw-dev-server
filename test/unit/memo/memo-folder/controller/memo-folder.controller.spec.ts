import { MemoFolderController } from '@/memo/controller/memo-folder.controller';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { Memo } from '@/memo/domain/memo/memo';
import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '@/memo/dto/memo-folder/create-memo-folder.dto';
import { MemoFolderDto } from '@/memo/dto/memo-folder/memo-folder.dto';
import { RequestUpdateMemoFolderDto, ResponseUpdateMemoFolderDto } from '@/memo/dto/memo-folder/update-memo-folder.dto';
import { MemoItemDto } from '@/memo/dto/memo/memo-item.dto';
import { CreateMemoFolderService } from '@/memo/service/memo-folder/create-memo-folder.service';
import { DeleteMemoFolderService } from '@/memo/service/memo-folder/delete-memo-folder.service';
import { FindChildMemoFoldersService } from '@/memo/service/memo-folder/find-child-memo-folders.service';
import { FindMemoFolderService } from '@/memo/service/memo-folder/find-memo-folder.service';
import { FindRootMemoFoldersService } from '@/memo/service/memo-folder/find-root-memo-folders.service';
import { UpdateMemoFolderService } from '@/memo/service/memo-folder/update-memo-folder.service';
import { FindFolderMemosService } from '@/memo/service/memo/find-folder-memos.service';
import { MockProxy, mock } from 'jest-mock-extended';

describe('MemoFolderController', () => {
  let sut: MemoFolderController;
  let mockCreateMemoFolderService: MockProxy<CreateMemoFolderService>;
  let mockFindMemoFolderService: MockProxy<FindMemoFolderService>;
  let mockFindRootMemoFoldersService: MockProxy<FindRootMemoFoldersService>;
  let mockFindChildMemoFoldersService: MockProxy<FindChildMemoFoldersService>;
  let mockUpdateMemoFolderService: MockProxy<UpdateMemoFolderService>;
  let mockDeleteMemoFolderService: MockProxy<DeleteMemoFolderService>;
  let mockFindFolderMemosService: MockProxy<FindFolderMemosService>;

  beforeEach(() => {
    mockCreateMemoFolderService = mock<CreateMemoFolderService>();
    mockFindMemoFolderService = mock<FindMemoFolderService>();
    mockFindRootMemoFoldersService = mock<FindRootMemoFoldersService>();
    mockFindChildMemoFoldersService = mock<FindChildMemoFoldersService>();
    mockUpdateMemoFolderService = mock<UpdateMemoFolderService>();
    mockDeleteMemoFolderService = mock<DeleteMemoFolderService>();
    mockFindFolderMemosService = mock<FindFolderMemosService>();

    sut = new MemoFolderController(
      mockCreateMemoFolderService,
      mockFindMemoFolderService,
      mockFindRootMemoFoldersService,
      mockFindChildMemoFoldersService,
      mockUpdateMemoFolderService,
      mockDeleteMemoFolderService,
      mockFindFolderMemosService,
    );
  });

  describe('메모 폴더를 생성하면', () => {
    it('생성한 폴더의 아이디를 반환한다', async () => {
      const requestDto: RequestCreateMemoFolderDto = {
        name: 'name',
        parentId: 'parentId',
      };
      const createdMemoFolder = MemoFolder.create(requestDto.name, requestDto.parentId);
      mockCreateMemoFolderService.execute.mockResolvedValue(createdMemoFolder);

      const result = await sut.createMemoFolder(requestDto);

      const responseDto: ResponseCreateMemoFolderDto = { id: createdMemoFolder.id };
      expect(result).toEqual(responseDto);
    });
  });

  describe('메모 폴더를 수정하면', () => {
    it('수정된 폴더의 아이디를 반환한다', async () => {
      const folderId = 'folderId';
      const requestDto: RequestUpdateMemoFolderDto = {
        name: 'updatedName',
        parentId: 'newParentId',
      };
      const updatedMemoFolder = MemoFolder.create(requestDto.name, requestDto.parentId);
      mockUpdateMemoFolderService.execute.mockResolvedValue(updatedMemoFolder);

      const result = await sut.updateMemoFolder(folderId, requestDto);

      const responseDto: ResponseUpdateMemoFolderDto = { id: updatedMemoFolder.id };
      expect(result).toEqual(responseDto);
      expect(mockUpdateMemoFolderService.execute).toHaveBeenCalledWith(folderId, requestDto);
    });
  });

  describe('최상위 메모 폴더 목록 조회', () => {
    it('최상위 메모 폴더 목록을 반환한다', async () => {
      const rootFolder1 = MemoFolder.create('folder1', null);
      const rootFolder2 = MemoFolder.create('folder2', null);
      const rootFolders = [rootFolder1, rootFolder2];
      mockFindRootMemoFoldersService.execute.mockResolvedValue(rootFolders);

      const result = await sut.getRootMemoFolders();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(MemoFolderDto.from(rootFolder1));
      expect(result[1]).toEqual(MemoFolderDto.from(rootFolder2));
    });
  });

  describe('메모 폴더의 하위 폴더 목록 조회', () => {
    it('하위 메모 폴더 목록을 반환한다', async () => {
      const parentId = 'parentId';
      const childFolder1 = MemoFolder.create('child1', parentId);
      const childFolder2 = MemoFolder.create('child2', parentId);
      const childFolders = [childFolder1, childFolder2];
      mockFindChildMemoFoldersService.execute.mockResolvedValue(childFolders);

      const result = await sut.getChildMemoFolders(parentId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(MemoFolderDto.from(childFolder1));
      expect(result[1]).toEqual(MemoFolderDto.from(childFolder2));
      expect(mockFindChildMemoFoldersService.execute).toHaveBeenCalledWith(parentId);
    });
  });

  describe('메모 폴더에 속한 메모 목록 조회', () => {
    it('메모 폴더에 속한 메모 목록을 반환한다', async () => {
      const folderId = 'folderId';
      const memo1 = Memo.create('memo1', 'memo-1', 'content1', folderId, '/path');
      const memo2 = Memo.create('memo2', 'memo-2', 'content2', folderId, '/path');
      const memos = [memo1, memo2];
      mockFindFolderMemosService.execute.mockResolvedValue(memos);

      const result = await sut.getFolderMemos(folderId);

      expect(result).toEqual(memos.map(MemoItemDto.from));
      expect(mockFindFolderMemosService.execute).toHaveBeenCalledWith(folderId);
    });
  });

  describe('메모 폴더 상세조회', () => {
    it('메모 폴더 정보를 반환한다', async () => {
      const folderId = 'folderId';
      const memoFolder = MemoFolder.create('folderName', null);
      mockFindMemoFolderService.execute.mockResolvedValue(memoFolder);

      const result = await sut.findMemoFolder(folderId);

      expect(result).toEqual(MemoFolderDto.from(memoFolder));
      expect(mockFindMemoFolderService.execute).toHaveBeenCalledWith(folderId);
    });
  });

  describe('메모 폴더 삭제', () => {
    it('메모 폴더를 삭제한다', async () => {
      const folderId = 'folderId';
      mockDeleteMemoFolderService.execute.mockResolvedValue();

      await sut.deleteMemoFolder(folderId);

      expect(mockDeleteMemoFolderService.execute).toHaveBeenCalledWith(folderId);
    });
  });
});

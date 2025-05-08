import { MemoController } from '@/memo/controller/memo.controller';
import { Memo } from '@/memo/domain/memo/memo';
import { RequestCreateMemoDto, ResponseCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { ResponseGetMemoDto } from '@/memo/dto/memo/get-memo.dto';
import { RequestUpdateMemoDto, ResponseUpdateMemoDto } from '@/memo/dto/memo/update-memo.dto';
import { CreateMemoService } from '@/memo/service/memo/create-memo.service';
import { DeleteMemoService } from '@/memo/service/memo/delete-memo.service';
import { GetMemoService } from '@/memo/service/memo/get-memo.service';
import { UpdateMemoService } from '@/memo/service/memo/update-memo.service';
import { MockProxy, mock } from 'jest-mock-extended';

describe(MemoController.name, () => {
  let sut: MemoController;
  let mockCreateMemoService: MockProxy<CreateMemoService>;
  let mockGetMemoService: MockProxy<GetMemoService>;
  let mockUpdateMemoService: MockProxy<UpdateMemoService>;
  let mockDeleteMemoService: MockProxy<DeleteMemoService>;

  beforeEach(() => {
    mockCreateMemoService = mock<CreateMemoService>();
    mockGetMemoService = mock<GetMemoService>();
    mockUpdateMemoService = mock<UpdateMemoService>();
    mockDeleteMemoService = mock<DeleteMemoService>();
    sut = new MemoController(mockCreateMemoService, mockGetMemoService, mockUpdateMemoService, mockDeleteMemoService);
  });

  describe('메모를 생성하면', () => {
    it('생성된 메모의 slug를 반환한다', async () => {
      const slug = 'slug';
      const requestDto: RequestCreateMemoDto = {
        content: 'content',
        folderId: 'folderId',
        name: 'name',
      };
      const createdMemo = Memo.create(requestDto.name, slug, requestDto.content, requestDto.folderId, 'path');
      mockCreateMemoService.execute.mockResolvedValue(createdMemo);

      const response = await sut.create(requestDto);

      const responseDto: ResponseCreateMemoDto = { slug };
      expect(response).toEqual(responseDto);
    });
  });

  describe('메모를 조회하면', () => {
    it('메모의 상세 정보를 반환한다', async () => {
      const slug = 'slug';
      const memo = Memo.create('name', slug, 'content', 'folderId', 'path');
      mockGetMemoService.execute.mockResolvedValue(memo);

      const result = await sut.getMemo(slug);

      const responseDto: ResponseGetMemoDto = {
        id: memo.id,
        name: memo.name.value,
        slug,
        content: memo.content,
        folderId: memo.folderId,
        path: memo.path,
      };

      expect(result).toEqual(responseDto);
    });
  });

  describe('메모를 수정하면', () => {
    it('수정된 메모의 slug를 반환한다', async () => {
      const slug = 'slug';
      const requestDto: RequestUpdateMemoDto = {
        content: 'content',
        folderId: 'folderId',
        name: 'name',
      };
      const updatedMemo = Memo.create(requestDto.name, slug, requestDto.content, requestDto.folderId, 'path');
      mockUpdateMemoService.execute.mockResolvedValue(updatedMemo);

      const result = await sut.updateMemo(slug, requestDto);

      const responseDto: ResponseUpdateMemoDto = { slug };
      expect(result).toEqual(responseDto);
    });
  });

  describe('메모를 삭제하면', () => {
    it('메모가 삭제된다', async () => {
      const slug = 'slug';

      await sut.deleteMemo(slug);

      expect(mockDeleteMemoService.execute).toHaveBeenCalledWith(slug);
    });
  });
});

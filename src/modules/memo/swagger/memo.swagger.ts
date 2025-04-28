import { RequestCreateMemoDto, ResponseCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { ResponseGetMemoDto } from '@/memo/dto/memo/get-memo.dto';
import { ResponseFindFolderMemosDto } from '@/memo/dto/memo/find-folder-memos.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiBody, ApiOkResponse, ApiParam } from '@nestjs/swagger';

export function createMemo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateMemoDto }),
    ApiCreatedResponse({ type: ResponseCreateMemoDto }),
  );
}

export function findFolderMemos(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ name: 'id', description: '메모 폴더 아이디' }),
    ApiOkResponse({ type: ResponseFindFolderMemosDto }),
  );
}

export function getMemo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ name: 'slug', description: '메모 슬러그' }),
    ApiOkResponse({ type: ResponseGetMemoDto }),
  );
}

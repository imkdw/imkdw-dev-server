import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '@/memo/dto/memo-folder/create-memo-folder.dto';
import { MemoFolderDto } from '@/memo/dto/memo-folder/memo-folder.dto';
import { RequestUpdateMemoFolderDto, ResponseUpdateMemoFolderDto } from '@/memo/dto/memo-folder/update-memo-folder.dto';
import { ResponseFindFolderMemosDto } from '@/memo/dto/memo/find-folder-memos.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function createMemoFolder(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateMemoFolderDto }),
    ApiCreatedResponse({ type: ResponseCreateMemoFolderDto }),
  );
}

export function updateMemoFolder(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestUpdateMemoFolderDto }),
    ApiOkResponse({ type: ResponseUpdateMemoFolderDto }),
  );
}

export function getMemoFolder(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: MemoFolderDto }));
}

export function findRootMemoFolders(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: [MemoFolderDto] }));
}

export function findChildMemoFolders(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: [MemoFolderDto] }));
}

export function deleteMemoFolder(summary: string) {
  return applyDecorators(ApiOperation({ summary }));
}

export function findFolderMemos(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ name: 'id', description: '메모 폴더 아이디' }),
    ApiOkResponse({ type: ResponseFindFolderMemosDto }),
  );
}

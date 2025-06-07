import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '@/memo/dto/memo-folder/create-memo-folder.dto';
import { MemoFolderDto } from '@/memo/dto/memo-folder/memo-folder.dto';
import { RequestUpdateMemoFolderDto } from '@/memo/dto/memo-folder/update-memo-folder.dto';
import { RequestUpdateMemoFolderNameDto } from '@/memo/dto/memo-folder/update-memo-folder-name.dto';
import { MemoItemDto } from '@/memo/dto/memo/memo-item.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

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
    ApiNoContentResponse({ description: '메모 폴더 수정 완료' }),
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
    ApiOkResponse({ type: [MemoItemDto] }),
  );
}

export function updateMemoFolderName(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestUpdateMemoFolderNameDto }),
    ApiNoContentResponse({ description: '메모 폴더 이름 변경 완료' }),
  );
}

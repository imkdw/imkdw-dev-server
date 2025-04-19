import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '@/memo/dto/memo-folder/create-memo-folder.dto';
import { MemoFolderDto } from '@/memo/dto/memo-folder/memo-folder.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function createMemoFolder(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateMemoFolderDto }),
    ApiCreatedResponse({ type: ResponseCreateMemoFolderDto }),
  );
}

export function getMemoFolder(summary: string) {
  return applyDecorators(ApiOperation({ summary }), ApiOkResponse({ type: MemoFolderDto }));
}

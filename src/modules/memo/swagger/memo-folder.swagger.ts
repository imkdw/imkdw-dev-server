import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '@/memo/dto/memo-folder/create-memo-folder.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

export function createMemoFolder(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateMemoFolderDto }),
    ApiCreatedResponse({ type: ResponseCreateMemoFolderDto }),
  );
}

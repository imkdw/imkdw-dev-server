import { RequestCreateMemoDto, ResponseCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { MemoDetailDto } from '@/memo/dto/memo/memo-detail';
import { RequestUpdateMemoDto, ResponseUpdateMemoDto } from '@/memo/dto/memo/update-memo.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function createMemo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateMemoDto }),
    ApiCreatedResponse({ type: ResponseCreateMemoDto }),
  );
}

export function getMemo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ name: 'slug', description: '메모 슬러그' }),
    ApiOkResponse({ type: MemoDetailDto }),
  );
}

export function updateMemo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ name: 'slug', description: '메모 슬러그' }),
    ApiBody({ type: RequestUpdateMemoDto }),
    ApiOkResponse({ type: ResponseUpdateMemoDto }),
  );
}

export function deleteMemo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiParam({ name: 'slug', description: '메모 슬러그' }),
    ApiNoContentResponse({ description: '메모가 성공적으로 삭제됨' }),
  );
}

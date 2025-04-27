import { RequestCreateMemoDto, ResponseCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';

export function createMemo(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: RequestCreateMemoDto }),
    ApiCreatedResponse({ type: ResponseCreateMemoDto }),
  );
}

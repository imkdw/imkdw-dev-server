import { ResponseGetUploadUrlDto } from '@/infra/storage/dto/get-upload-url.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function getUploadUrl(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({
      description: '업로드 URL 반환',
      type: ResponseGetUploadUrlDto,
    }),
  );
}

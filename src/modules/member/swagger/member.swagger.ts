import { ResponseGetMyInfoDto } from '@/member/dto/member/get-my-info.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export const getMyInfo = (summary: string) => {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiOkResponse({ description: '회원 정보', type: ResponseGetMyInfoDto }),
  );
};

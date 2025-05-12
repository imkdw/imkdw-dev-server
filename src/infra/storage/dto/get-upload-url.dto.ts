import { IsNotEmptyString } from '@/common/decorator/is-not-empty-string.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RequestGetUploadUrlQuery {
  @ApiProperty({ description: '업로드 할 파일명(UUID 형식)', example: '375F416C-2582-40BF-A477-2430586C566B' })
  @IsUUID()
  fileName: string;

  @ApiProperty({ description: '파일의 확장자', example: 'jpg' })
  @IsNotEmptyString()
  extension: string;
}

export class ResponseGetUploadUrlDto {
  @ApiProperty({ description: '파일 업로드 URL' })
  url: string;
}

import { IsNotEmptyString } from '@/common/decorator/is-not-empty-string.decorator';
import { Memo } from '@/memo/domain/memo/memo';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateMemoDto {
  @ApiProperty({ description: '메모 이름', example: 'Nest.js' })
  @IsNotEmptyString()
  name: string;

  @ApiProperty({ description: '메모 내용', example: 'Nest.js는 타입스크립트 기반의 프레임워크입니다' })
  @IsNotEmptyString()
  content: string;

  @ApiProperty({ description: '메모를 작성한 폴더 아이디', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmptyString()
  folderId: string;

  @ApiProperty({ description: '메모를 작성한 폴더 경로', example: '/root/nest.js' })
  @IsNotEmptyString()
  path: string;
}

export class ResponseCreateMemoDto {
  @ApiProperty({ description: '생성된 메모 slug', example: 'memo-slug' })
  slug: string;

  private constructor(slug: string) {
    this.slug = slug;
  }

  static from(memo: Memo): ResponseCreateMemoDto {
    return new ResponseCreateMemoDto(memo.slug);
  }
}

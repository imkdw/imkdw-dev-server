import { Memo } from '@/memo/domain/memo/memo';
import { ApiProperty } from '@nestjs/swagger';

export class MemoDetailDto {
  @ApiProperty({ description: '메모 아이디', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: '메모 이름', example: 'Nest.js' })
  name: string;

  @ApiProperty({ description: '메모 슬러그', example: 'nest-js' })
  slug: string;

  @ApiProperty({ description: '메모 내용', example: 'Nest.js는 타입스크립트 기반의 프레임워크입니다' })
  content: string;

  @ApiProperty({ description: '메모 폴더 아이디', example: '123e4567-e89b-12d3-a456-426614174000' })
  folderId: string;

  @ApiProperty({ description: '메모 폴더 경로', example: '/root/nest.js' })
  path: string;

  private constructor(id: string, name: string, slug: string, content: string, folderId: string, path: string) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.content = content;
    this.folderId = folderId;
    this.path = path;
  }

  static from(memo: Memo): MemoDetailDto {
    return new MemoDetailDto(memo.id, memo.name.value, memo.slug, memo.content.value, memo.folderId, memo.path);
  }
}

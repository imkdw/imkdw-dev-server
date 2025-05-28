import { Memo } from '@/memo/domain/memo/memo';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class RequestUpdateMemoDto {
  @ApiProperty({ description: '메모 제목', example: '메모 제목' })
  @IsString()
  name: string;

  @ApiProperty({ description: '메모 내용', example: '메모 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '메모 내용(HTML)', example: '<h1>메모 제목</h1><p>메모 내용</p>' })
  @IsString()
  contentHtml: string;

  @ApiProperty({ description: '메모 폴더 ID', example: 'folder-id' })
  @IsString()
  folderId: string;

  @ApiProperty({ description: '업로드한 이미지 목록', example: ['image1.png', 'image2.png'] })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];
}

export class ResponseUpdateMemoDto {
  @ApiProperty({ description: '메모의 slug', example: 'memo-slug' })
  slug: string;

  private constructor(memo: Memo) {
    this.slug = memo.slug;
  }

  static from(memo: Memo): ResponseUpdateMemoDto {
    return new ResponseUpdateMemoDto(memo);
  }
}

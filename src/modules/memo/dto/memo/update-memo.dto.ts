import { Memo } from '@/memo/domain/memo/memo';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestUpdateMemoDto {
  @ApiProperty({ description: '메모 제목', example: '메모 제목' })
  @IsString()
  name: string;

  @ApiProperty({ description: '메모 내용', example: '메모 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '메모 폴더 ID', example: 'folder-id' })
  @IsString()
  folderId: string;
}

export class ResponseUpdateMemoDto {
  @ApiProperty({ description: '메모 ID', example: 'memo-id' })
  id: string;

  private constructor(memo: Memo) {
    this.id = memo.id;
  }

  static from(memo: Memo): ResponseUpdateMemoDto {
    return new ResponseUpdateMemoDto(memo);
  }
}

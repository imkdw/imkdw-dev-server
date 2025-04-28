import { Memo } from '@/memo/domain/memo/memo';
import { ApiProperty } from '@nestjs/swagger';

export class FindFolderMemoItemDto {
  @ApiProperty({ description: '메모 아이디', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: '메모 이름', example: 'Nest.js' })
  name: string;

  @ApiProperty({ description: '메모 슬러그', example: 'nest-js' })
  slug: string;


  private constructor(id: string, name: string, slug: string) {
    this.id = id;
    this.name = name;
    this.slug = slug;
  }

  static from(memo: Memo): FindFolderMemoItemDto {
    return new FindFolderMemoItemDto(memo.id, memo.name, memo.slug);
  }
}

export class ResponseFindFolderMemosDto {
  @ApiProperty({ description: '메모 목록', type: [FindFolderMemoItemDto] })
  memos: FindFolderMemoItemDto[];

  private constructor(memos: FindFolderMemoItemDto[]) {
    this.memos = memos;
  }

  static from(memos: Memo[]): ResponseFindFolderMemosDto {
    const memoItems = memos.map(FindFolderMemoItemDto.from);
    return new ResponseFindFolderMemosDto(memoItems);
  }
}

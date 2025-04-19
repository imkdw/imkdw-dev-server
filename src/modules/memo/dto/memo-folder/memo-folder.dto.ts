import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { ApiProperty } from '@nestjs/swagger';

export class MemoFolderDto {
  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  @ApiProperty({ description: '메모 폴더 아이디', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: '메모 폴더 이름', example: 'Nest.js' })
  name: string;

  static from(memoFolder: MemoFolder): MemoFolderDto {
    return new MemoFolderDto(memoFolder.id, memoFolder.name.value);
  }
}

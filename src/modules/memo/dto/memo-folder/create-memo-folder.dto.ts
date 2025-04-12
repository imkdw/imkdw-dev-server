import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../../../common/decorator/is-not-empty-string.decorator';
import { IsNullableString } from '../../../../common/decorator/is-nullable-string.decorator';
import { MemoFolder } from '../../domain/memo-folder/memo-folder';

export class RequestCreateMemoFolderDto {
  @ApiProperty({ description: 'name of folder', example: 'nestjs' })
  @IsNotEmptyString()
  name: string;

  @ApiProperty({ description: 'parent folder id', example: '123e4567-e89b-12d3-a456-426614174000', nullable: true })
  @IsNullableString()
  parentId: string | null;
}

export class ResponseCreateMemoFolderDto {
  @ApiProperty({ description: 'created folder id', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  static from(memoFolder: MemoFolder): ResponseCreateMemoFolderDto {
    return new ResponseCreateMemoFolderDto(memoFolder.id);
  }
}

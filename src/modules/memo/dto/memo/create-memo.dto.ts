import { IsNotEmptyString } from '@/common/decorator/is-not-empty-string.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateMemoDto {
  @ApiProperty({ description: '메모 제목', example: 'Nest.js' })
  @IsNotEmptyString()
  title: string;

  @ApiProperty({ description: '메모 내용', example: 'Nest.js는 타입스크립트 기반의 프레임워크입니다' })
  @IsNotEmptyString()
  content: string;

  @ApiProperty({ description: '메모를 작성한 폴더 아이디', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmptyString()
  folderId: string;

  @ApiProperty({ description: '메모를 작성한 폴더 경로', example: '/root/nest.js' })
  @IsNotEmptyString()
  folderPath: string;
}

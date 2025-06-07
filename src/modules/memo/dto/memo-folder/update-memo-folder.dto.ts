import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../../../common/decorator/is-not-empty-string.decorator';
import { IsNullableString } from '../../../../common/decorator/is-nullable-string.decorator';

export class RequestUpdateMemoFolderDto {
  @ApiProperty({ description: '폴더명', example: 'nestjs' })
  @IsNotEmptyString()
  name: string;

  @ApiProperty({ description: '부모 폴더 아이디', example: '123e4567-e89b-12d3-a456-426614174000', nullable: true })
  @IsNullableString()
  parentId: string | null;
}

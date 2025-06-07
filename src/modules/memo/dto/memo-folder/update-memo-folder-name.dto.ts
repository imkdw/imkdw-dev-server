import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../../../common/decorator/is-not-empty-string.decorator';

export class RequestUpdateMemoFolderNameDto {
  @ApiProperty({ description: '폴더명', example: 'nestjs' })
  @IsNotEmptyString()
  name: string;
}

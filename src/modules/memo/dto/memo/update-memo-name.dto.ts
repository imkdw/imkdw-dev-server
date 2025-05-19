import { IsNotEmptyString } from '@/common/decorator/is-not-empty-string.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUpdateMemoNameDto {
  @ApiProperty({ description: '메모 이름', example: '새로운 메모 이름' })
  @IsNotEmptyString()
  name: string;
}

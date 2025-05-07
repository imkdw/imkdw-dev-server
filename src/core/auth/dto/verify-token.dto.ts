import { ApiProperty } from '@nestjs/swagger';

export class ResponseVerifyTokenDto {
  @ApiProperty({ description: '토큰 유효여부', example: true })
  isValid: boolean;
}

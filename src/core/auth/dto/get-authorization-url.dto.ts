import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetAuthorizationUrlDto {
  @ApiProperty({ description: '소셜로그인 URL', example: 'https://github.com/login/oauth/authorize' })
  url: string;
}

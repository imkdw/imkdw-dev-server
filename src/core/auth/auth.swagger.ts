import { ResponseGetAuthorizationUrlDto } from '@/core/auth/dto/get-authorization-url.dto';
import { ResponseVerifyTokenDto } from '@/core/auth/dto/verify-token.dto';
import { OAuthProvider } from '@/core/auth/oauth.enum';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function getOAuthAuthorizationUrl(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiQuery({
      name: 'redirectUrl',
      description: '리다이렉트될 URL',
      example: 'https://localhost:3000/oauth/callback',
    }),
    ApiParam({
      name: 'provider',
      description: '소셜로그인 플랫폼',
      enum: OAuthProvider,
      example: OAuthProvider.GITHUB,
    }),
    ApiOkResponse({ type: ResponseGetAuthorizationUrlDto }),
  );
}

export function oAuthCallback(summary: string) {
  return applyDecorators(
    ApiOperation({ summary, description: '소셜로그인 인증 후 리다이렉트되는 서버측 URL' }),
    ApiQuery({ name: 'code', description: 'OAuth 인증 후 발급받은 코드' }),
    ApiQuery({ name: 'state', description: '상태(클라이언트 측 리다이렉트 URL로 사용)' }),
    ApiParam({ name: 'provider', description: '소셜로그인 플랫폼', enum: OAuthProvider }),
    ApiResponse({
      status: HttpStatus.FOUND,
      description: 'accessToken을 발급받은 후 요청한 클라이언트 측 URL로 리다이렉트됨',
      example: 'https://localhost:3000/oauth/callback?accessToken=1234567890&provider=github',
    }),
  );
}

export function verifyToken(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiQuery({ name: 'token', description: '확인할 토큰' }),
    ApiOkResponse({ type: ResponseVerifyTokenDto }),
  );
}

export function logout(summary: string) {
  return applyDecorators(ApiOperation({ summary }));
}

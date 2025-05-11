import { ResponseGetAuthorizationUrlDto } from '@/core/auth/dto/get-authorization-url.dto';
import { OAuthStrategyFactory } from '@/core/auth/strategy/oauth-strategy.factory';
import { Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Cookie } from '@/common/decorator/cookie.decorator';
import { Public } from '@/common/decorator/public.decorator';
import { ResponseVerifyTokenDto } from '@/core/auth/dto/verify-token.dto';
import { VerifyTokenService } from '@/core/auth/service/verify-token.service';
import { CookieMaxAge } from '@/infra/cookie/cookie.enum';
import { CookieService } from '@/infra/cookie/cookie.service';
import * as Swagger from './auth.swagger';

@ApiTags('[인증]')
@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly oauthStrategyFactory: OAuthStrategyFactory,
    private readonly cookieService: CookieService,
    private readonly verifyTokenService: VerifyTokenService,
  ) {}

  @Swagger.getOAuthAuthorizationUrl('소셜로그인 URL 발급')
  @Get(':provider/authorization')
  async getGithubAuthorizationUrl(
    @Query('redirectUrl') redirectUrl: string,
    @Param('provider') provider: string,
  ): Promise<ResponseGetAuthorizationUrlDto> {
    const strategy = this.oauthStrategyFactory.getStrategy(provider);
    const url = strategy.getAuthorizationUrl(redirectUrl);
    return { url };
  }

  @Swagger.oAuthCallback('소셜로그인 콜백')
  @Get(':provider/callback')
  async getGithubCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Param('provider') provider: string,
    @Res() res: Response,
  ) {
    const strategy = this.oauthStrategyFactory.getStrategy(provider);
    const { accessToken, refreshToken, redirectUrl } = await strategy.signIn(code, state);
    this.setToken(accessToken, refreshToken, res);
    return res.redirect(redirectUrl);
  }

  @Swagger.verifyToken('토큰 유효성 검사')
  @Get('verify-token')
  async verifyToken(@Cookie() cookie: string): Promise<ResponseVerifyTokenDto> {
    const result = await this.verifyTokenService.execute(cookie);
    return { isValid: result };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clearCookie(['accessToken', 'refreshToken'], res);
  }

  private setToken(accessToken: string, refreshToken: string, res: Response) {
    this.cookieService.setCookie({
      key: 'accessToken',
      value: accessToken,
      maxAge: CookieMaxAge.HOUR_1,
      res,
    });

    if (refreshToken) {
      this.cookieService.setCookie({
        key: 'refreshToken',
        value: refreshToken,
        maxAge: CookieMaxAge.DAY_30,
        res,
      });
    }
  }
}

import { ResponseGetAuthorizationUrlDto } from '@/core/auth/dto/get-authorization-url.dto';
import { Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OAuthStrategyFactory } from '@/core/auth/strategy/oauth-strategy.factory';
import { Authorization } from '@/common/decorator/authorization.decorator';
import { Response } from 'express';

import * as Swagger from './auth.swagger';
import { CookieService } from '@/infra/cookie/cookie.service';
import { CookieMaxAge } from '@/infra/cookie/cookie.enum';
import { Public } from '@/common/decorator/public.decorator';

@ApiTags('[인증]')
@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly oauthStrategyFactory: OAuthStrategyFactory,
    private readonly cookieService: CookieService,
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const strategy = this.oauthStrategyFactory.getStrategy(provider);
    const { accessToken, redirectUrl } = await strategy.getAccessToken(code, state);
    return res.redirect(`${redirectUrl}?accessToken=${accessToken}&provider=${provider}`);
  }

  @Swagger.oAuthSignIn('소셜로그인 인증처리')
  @Post(':provider/signin')
  async getGithubSignIn(
    @Param('provider') provider: string,
    @Authorization() oAuthAccessToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const strategy = this.oauthStrategyFactory.getStrategy(provider);
    const { accessToken, refreshToken } = await strategy.signIn(oAuthAccessToken);
    this.setToken(accessToken, refreshToken, res);
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

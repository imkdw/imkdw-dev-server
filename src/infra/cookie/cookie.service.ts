import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { Env } from '@/common/enums/env.enum';
import { MyConfigService } from '@/core/config/my-config.service';
import { CookieSameSite } from '@/infra/cookie/cookie.enum';
import { SetCookieParams } from '@/infra/cookie/cookie.type';

@Injectable()
export class CookieService {
  private readonly env: string;
  private readonly cookieDomain: string;

  constructor(private readonly myConfigService: MyConfigService) {
    this.env = this.myConfigService.get('ENV');
    this.cookieDomain = this.myConfigService.get('AUTH_COOKIE_DOMAIN');
  }

  setCookie(params: SetCookieParams): void {
    const { key, value, maxAge, res } = params;
    res.cookie(key, value, {
      domain: this.cookieDomain,
      httpOnly: true,
      path: '/',
      secure: this.generateSecure(),
      maxAge,
      sameSite: this.generateSameSite(),
    });
  }

  clearCookie(cookies: SetCookieParams['key'][], res: Response) {
    cookies.forEach((cookie) => {
      res.clearCookie(cookie, {
        domain: this.cookieDomain,
        httpOnly: true,
        path: '/',
        secure: this.generateSecure(),
        sameSite: this.generateSameSite(),
      });
    });
  }

  private generateSecure(): boolean {
    /**
     * 쿠키의 secure 설정
     *
     * 1. development 환경의 경우 localhost api 접근을 위해 secure를 true로 설정
     * 2. production 환경의 경우 secure를 true로 설정
     * 3. 그 외는 false로 설정
     */
    switch (this.env) {
      case Env.DEVELOPMENT:
        return true;
      case Env.PRODUCTION:
        return true;
      default:
        return false;
    }
  }

  private generateSameSite(): CookieSameSite {
    /**
     * 쿠키의 sameSite 설정
     *
     * 1) development 환경의 경우 localhost api 접근을 위해 none으로 설정
     * 2) production 및 그 외의 경우 lax로 설정
     */
    switch (this.env) {
      case Env.DEVELOPMENT:
        return CookieSameSite.NONE;
      case Env.PRODUCTION:
        return CookieSameSite.LAX;
      default:
        return CookieSameSite.LAX;
    }
  }
}

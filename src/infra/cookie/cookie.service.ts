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
      sameSite: CookieSameSite.STRICT,
    });
  }

  clearCookie(cookies: string[], res: Response) {
    cookies.forEach((cookie) => {
      res.clearCookie(cookie, {
        domain: this.cookieDomain,
        httpOnly: true,
        path: '/',
        secure: this.generateSecure(),
        sameSite: CookieSameSite.STRICT,
      });
    });
  }

  private generateSecure(): boolean {
    switch (this.env) {
      case Env.DEVELOPMENT:
      case Env.PRODUCTION:
        return true;
      default:
        return false;
    }
  }
}

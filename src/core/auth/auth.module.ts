import { AuthController } from '@/core/auth/auth.controller';
import { GithubOAuthStrategy } from '@/core/auth/strategy/github-oauth.strategy';
import { OAuthStrategyFactory } from '@/core/auth/strategy/oauth-strategy.factory';
import { MyConfigModule } from '@/core/config/my-config.module';
import { CookieModule } from '@/infra/cookie/cookie.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [MyConfigModule, JwtModule, CookieModule],
  controllers: [AuthController],
  providers: [GithubOAuthStrategy, OAuthStrategyFactory],
})
export class AuthModule {}

import { AuthController } from '@/core/auth/auth.controller';
import { OAuthService } from '@/core/auth/service/oauth.service';
import { VerifyTokenService } from '@/core/auth/service/verify-token.service';
import { GithubOAuthStrategy } from '@/core/auth/strategy/github-oauth.strategy';
import { GoogleOAuthStrategy } from '@/core/auth/strategy/google-oauth.strategy';
import { OAuthStrategyFactory } from '@/core/auth/strategy/oauth-strategy.factory';
import { MyConfigModule } from '@/core/config/my-config.module';
import { CookieModule } from '@/infra/cookie/cookie.module';
import { HttpModule } from '@/infra/http/http.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { StorageModule } from '@/infra/storage/storage.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [MyConfigModule, JwtModule, CookieModule, StorageModule, HttpModule],
  controllers: [AuthController],
  providers: [GithubOAuthStrategy, GoogleOAuthStrategy, OAuthStrategyFactory, OAuthService, VerifyTokenService],
})
export class AuthModule {}

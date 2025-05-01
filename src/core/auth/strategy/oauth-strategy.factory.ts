import { NotSupportedOAuthProviderException } from '@/core/auth/exception/not-supported-oauth-provider.exception';
import { OAuthProvider } from '@/core/auth/oauth.const';
import { GithubOAuthStrategy } from '@/core/auth/strategy/github-oauth.strategy';
import { OAuthStrategy } from '@/core/auth/strategy/oauth.strategy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OAuthStrategyFactory {
  constructor(private readonly githubStrategy: GithubOAuthStrategy) {}

  getStrategy(provider: string): OAuthStrategy {
    switch (provider) {
      case OAuthProvider.GITHUB:
        return this.githubStrategy;
      default:
        throw new NotSupportedOAuthProviderException(`${provider}는 지원하지 않는 소셜 로그인 플랫폼입니다`);
    }
  }
}

import { sign, JwtPayload, verify, TokenExpiredError, decode } from 'jsonwebtoken';
import { MyConfigService } from '@/core/config/my-config.service';
import { CreateJwtResult, JwtTokenType, MyJwtPayload } from '@/infra/jwt/jwt.type';
import { Injectable } from '@nestjs/common';
import { InvalidJwtException } from '@/infra/jwt/exception/invalid-jwt.exception';
import { JwtExpiredException } from '@/infra/jwt/exception/jwt-expired.exception';

@Injectable()
export class JwtService {
  private readonly jwtSecret: string;

  constructor(private readonly myConfigService: MyConfigService) {
    this.jwtSecret = myConfigService.get('JWT_SECRET');
  }

  private getExpiresIn(tokenType: JwtTokenType): number {
    return +this.myConfigService.get(`JWT_${tokenType}_EXPIRE`);
  }

  private isJwtPayload(payload: string | JwtPayload): payload is MyJwtPayload {
    return typeof payload === 'object' && payload !== null;
  }

  createJwt(payload: MyJwtPayload): CreateJwtResult {
    return {
      accessToken: sign(payload, this.jwtSecret, {
        expiresIn: this.getExpiresIn('ACCESS'),
      }),
      refreshToken: sign(payload, this.jwtSecret, {
        expiresIn: this.getExpiresIn('REFRESH'),
      }),
    };
  }

  verifyJwt(token: string): MyJwtPayload {
    try {
      const verifiedJwt = verify(token, this.jwtSecret);

      if (!this.isJwtPayload(verifiedJwt)) {
        throw new InvalidJwtException(`유효하지 않은 토큰, token: ${token}`);
      }

      return verifiedJwt;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new JwtExpiredException(`만료된 토큰, token: ${token}`);
      }

      throw new InvalidJwtException(`유효하지 않은 토큰, token: ${token}`);
    }
  }

  decodeJwt(token: string): MyJwtPayload & { [key: string]: unknown } {
    return decode(token) as MyJwtPayload & { [key: string]: unknown };
  }
}

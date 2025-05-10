import { parseJwtFromCookie } from '@/common/utils/authorization.util';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async execute(cookie: string): Promise<boolean> {
    const { accessToken } = parseJwtFromCookie(cookie);
    try {
      this.jwtService.verifyJwt(accessToken);
      return true;
    } catch {
      return false;
    }
  }
}

import { extractToken } from '@/common/utils/authorization.util';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async execute(authorization: string): Promise<boolean> {
    const token = extractToken(authorization);
    try {
      this.jwtService.verifyJwt(token);
      return true;
    } catch {
      return false;
    }
  }
}

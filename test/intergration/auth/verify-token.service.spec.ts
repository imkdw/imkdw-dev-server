import { VerifyTokenService } from '@/core/auth/service/verify-token.service';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Test } from '@nestjs/testing';

describe(VerifyTokenService.name, () => {
  let sut: VerifyTokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [VerifyTokenService],
    }).compile();

    sut = module.get<VerifyTokenService>(VerifyTokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('토큰이 유효하지 않은 경우', () => {
    it('false를 반환한다', async () => {
      const result = await sut.execute('invalid-token');

      expect(result).toBe(false);
    });
  });

  describe('토큰에 Bearer 헤더가 없는 경우', () => {
    it('false를 반환한다', async () => {
      const { accessToken } = jwtService.createJwt({ id: '123' });

      const result = await sut.execute(accessToken);

      expect(result).toBe(false);
    });
  });

  describe('토큰이 유효한 경우', () => {
    it('true를 반환한다', async () => {
      const { accessToken } = jwtService.createJwt({ id: '123' });

      const result = await sut.execute(`Bearer ${accessToken}`);

      expect(result).toBe(true);
    });
  });
});

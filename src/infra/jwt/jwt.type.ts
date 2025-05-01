import { JwtPayload } from 'jsonwebtoken';

export type JwtTokenType = 'ACCESS' | 'REFRESH';

/**
 * JWT 내부 페이로드 타입
 */
export interface MyJwtPayload extends Pick<JwtPayload, 'iat' | 'exp'> {
  id: string;
}

export interface CreateJwtResult {
  accessToken: string;
  refreshToken: string;
}

/**
 * JWT 검증 관련 타입
 */
export interface VerifyJwtParams {
  token: string;
}

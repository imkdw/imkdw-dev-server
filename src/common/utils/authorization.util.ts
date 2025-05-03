/**
 * 인증 헤더에서 토큰 추출
 * @example
 * ```ts
 * extractToken('Bearer 1234567890'); // '1234567890'
 * extractToken('Basic 1234567890'); // ''
 * ```
 */
export function extractToken(authorization: string): string {
  if (!authorization) {
    return '';
  }

  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer') {
    return '';
  }

  return token;
}

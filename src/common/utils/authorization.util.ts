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

/**
 * 쿠키에서 토큰 추출
 * @param cookie 쿠키
 * @returns 토큰
 */
export function parseJwtFromCookie(cookie: string) {
  const tokenCookies: { [key: string]: string } = {};

  cookie.split(';').forEach((_cookie: string) => {
    const trimCookie = _cookie.trim();
    const mid = trimCookie.indexOf('=');
    const [key, value] = [trimCookie.slice(0, mid), trimCookie.slice(mid + 1)];
    tokenCookies[key] = value;
  });

  const accessToken = tokenCookies?.accessToken || '';
  const refreshToken = tokenCookies?.refreshToken || '';

  return { accessToken, refreshToken };
}

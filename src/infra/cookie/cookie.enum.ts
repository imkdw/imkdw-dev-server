export enum CookieMaxAge {
  HOUR_1 = 1 * 60 * 60 * 1000,
  DAY_30 = 30 * 24 * 60 * 60 * 1000,
}

export enum CookieSameSite {
  NONE = 'none',
  LAX = 'lax',
  STRICT = 'strict',
}

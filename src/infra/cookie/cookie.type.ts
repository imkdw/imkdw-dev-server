import { CookieMaxAge } from '@/infra/cookie/cookie.enum';
import { Response } from 'express';

export interface SetCookieParams {
  key: string;
  value: string;
  maxAge: CookieMaxAge;
  res: Response;
}

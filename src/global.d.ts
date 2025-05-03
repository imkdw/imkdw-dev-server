import { Requester } from '@/common/types/requester.type';

declare module 'express' {
  interface Request {
    user?: Requester;
  }
}

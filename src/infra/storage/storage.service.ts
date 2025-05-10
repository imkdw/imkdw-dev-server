import { GeneratePathParams, UploadParams } from '@/infra/storage/storage.type';

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface StorageService {
  upload(params: UploadParams): Promise<string>;
  generatePath(params: GeneratePathParams[], extension: string): string;
}

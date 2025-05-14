import { GetUploadUrlReturn, UploadParams } from '@/infra/storage/types/storage.type';

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface StorageService {
  /**
   * 파일 업로드
   */
  upload(params: UploadParams): Promise<string>;

  /**
   * 파일 업로드 URL 발급
   */
  getUploadUrl(fileName: string, extension: string): Promise<GetUploadUrlReturn>;
}

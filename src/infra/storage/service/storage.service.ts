import { GetUploadUrlReturn, UploadParams } from '@/infra/storage/types/storage.type';

export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface StorageService {
  /**
   * 파일 업로드
   */
  upload(params: UploadParams): Promise<string>;

  /**
   * 임시 파일업로드 URL 발급
   */
  getTempUploadUrl(fileName: string, extension: string): Promise<GetUploadUrlReturn>;

  /**
   * 이미지를 특정 경로로 복사
   */
  copyTempImage(fileName: string, destinationPath: string): Promise<void>;
}

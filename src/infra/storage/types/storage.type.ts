export interface UploadParams {
  /**
   * 업로드할 파일 경로
   */
  path: string;

  /**
   * 업로드할 파일
   */
  file: Buffer;
}

export interface GetUploadUrlReturn {
  uploadUrl: string;
  pathPrefix: string;
}

export enum ErrorCode {
  /**
   * 메모 폴더 에러
   */
  INVALID_MEMO_FOLDER_NAME = '0000',
  DUPLICATE_MEMO_FOLDER_NAME = '0001',
  MEMO_FOLDER_NOT_FOUND = '0002',

  /**
   * 메모 에러
   */
  DUPLICATE_MEMO_NAME = '0003',
  MEMO_NOT_FOUND = '0004',
  INVALID_MEMO_NAME = '0005',

  /**
   * 인증 에러
   */
  SIGN_IN_FAILED = '0006',
  NOT_SUPPORTED_OAUTH_PROVIDER = '0007',
  INVALID_JWT = '0008',
  JWT_EXPIRED = '0009',

  /**
   * 회원 에러
   */
  MEMBER_NOT_FOUND = '0010',
}

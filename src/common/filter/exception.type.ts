export interface ExceptionResponse {
  statusCode: number;
  errorCode: string;
  message: string;
  path: string;
  stack?: unknown;
}

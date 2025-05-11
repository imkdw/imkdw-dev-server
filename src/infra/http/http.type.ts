export interface HttpHeaders {
  // biome-ignore lint/suspicious/noExplicitAny: 헤더 반환값은 any로 지정
  [key: string]: any;
}

export interface HttpRequestConfig {
  headers?: HttpHeaders;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | 'stream';
}

export interface HttpResponse<T = unknown> {
  data: T;
  headers: HttpHeaders;
}

export interface RequestParams {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  data?: unknown;
  config?: HttpRequestConfig;
}

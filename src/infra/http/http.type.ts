export interface HttpHeaders {
  [header: string]: string;
}

export interface HttpRequestConfig {
  headers?: HttpHeaders;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | 'stream';
}

export interface HttpResponse<T = unknown> {
  data: T;
}

export interface RequestParams {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  data?: unknown;
  config?: HttpRequestConfig;
}

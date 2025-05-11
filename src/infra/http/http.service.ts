import { HttpRequestConfig, HttpResponse } from '@/infra/http/http.type';

export const HTTP_SERVICE = Symbol('HTTP_SERVICE');

export interface HttpService {
  get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
  post<T, V>(url: string, data?: V, config?: HttpRequestConfig): Promise<HttpResponse<T>>;
}

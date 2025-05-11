import { HttpService } from '@/infra/http/http.service';
import { HttpRequestConfig, HttpResponse, RequestParams } from '@/infra/http/http.type';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosHttpService implements HttpService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  async get<T>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ url, config, method: 'GET' });
  }

  async post<T, V>(url: string, data?: V, config?: HttpRequestConfig): Promise<HttpResponse<T>> {
    return this.request<T>({ url, data, config, method: 'POST' });
  }

  private async request<T>(params: RequestParams): Promise<HttpResponse<T>> {
    const { url, data, config, method } = params;

    const response = await this.axiosInstance.request<T>({
      url,
      data,
      method,
      ...config,
    });

    return { data: response.data };
  }
}

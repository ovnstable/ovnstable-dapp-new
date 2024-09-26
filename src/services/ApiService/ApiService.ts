/* eslint-disable no-use-before-define */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

export interface IApiService {
    get<T>(url: string, params?: any): Promise<T>;
  }

abstract class ApiService implements IApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, { params });
      return response.data as any;
    } catch (error) {
      throw new Error(`GET request failed: ${error}`);
    }
  }

  public async post<T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data as any;
    } catch (error) {
      throw new Error(`POST request failed: ${error}`);
    }
  }
}

export default ApiService;

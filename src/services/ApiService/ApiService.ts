/* eslint-disable no-use-before-define */
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export interface IApiService {
    get<T>(url: string, params?: any): Promise<AxiosResponse<T>>;
  }

abstract class ApiService implements IApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  public async get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, { params });
      return response.data as any;
    } catch (error) {
      throw new Error(`GET request failed: ${error}`);
    }
  }
}

export default ApiService;

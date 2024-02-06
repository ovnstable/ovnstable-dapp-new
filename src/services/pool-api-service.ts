/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
import apiService from './api-service.ts';

class PoolApiService {
  getAllPools(apiUrl: string) {
    return new Promise((resolve, reject) => {
      apiService.get(`${apiUrl}/pools/all`)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
export const poolApiService = new PoolApiService();

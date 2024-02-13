/* eslint-disable class-methods-use-this */
import { getErrorObject } from '@/utils/errors.ts';
import apiService from './api-service.ts';

const API_URL = 'https://api.overnight.fi';

class InsuranceApiService {
  loadInsuranceData(chain: string): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/${chain}/usd+/ins/data`;
      apiService.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadPayouts(chain: string): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/${chain}/usd+/ins/payouts`;
      apiService.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }
}

export default new InsuranceApiService();

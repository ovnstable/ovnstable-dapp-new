/* eslint-disable class-methods-use-this */
import { getErrorObject } from '@/utils/errors.ts';
import apiService from './api-service.ts';

const API_URL = 'https://api.overnight.fi';

class DashboardApiService {
  loadBalanceChange(chain: string, token: string, address: string): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/${chain}/${token}/dapp/clientBalanceChanges?address=${address}`;
      console.log(`here is the url from load balance ${url}`);
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

export default new DashboardApiService();

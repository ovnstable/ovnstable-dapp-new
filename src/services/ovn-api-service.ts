/* eslint-disable class-methods-use-this */
import axios from 'axios';
import { getErrorObject } from '@/utils/errors.ts';
import apiService from './api-service.ts';

const API_CORS = 'https://proxy.cors.sh/';
const API_URL = 'https://pro-api.coinmarketcap.com/v2';

class OVNApiService {
  loadPrice() {
    return new Promise((resolve, reject) => {
      const url = `${API_CORS}${API_URL}/cryptocurrency/quotes/latest`;
      const params = {
        symbol: 'OVN',
      };
      const headers = {
        'x-cors-api-key': import.meta.env.VITE_APP_API_KEY_X_CORS,
        'X-CMC_PRO_API_KEY': import.meta.env.VITE_APP_API_KEY_CMC,
      };

      axios.get(url, { params, headers })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  loadTVLOVN(chainScan: any, poolAddress: any, ovnAddress: any, apiKey: any) {
    return new Promise((resolve, reject) => {
      apiService.get(`${chainScan}/api?module=account&action=tokenbalance&contractaddress=${ovnAddress.toLowerCase()}&address=${poolAddress.toLowerCase()}&tag=latest&apikey=${apiKey}`)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }
}

export default new OVNApiService();

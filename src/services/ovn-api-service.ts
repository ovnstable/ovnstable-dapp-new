/* eslint-disable class-methods-use-this */
import { getErrorObject } from '@/utils/errors.ts';
import axios from 'axios';
import apiService from './api-service.ts';

const API_URL = 'https://pro-api.coinmarketcap.com';
const API_KEY = ' dde601e1-d49d-4320-8546-8efacdd506cd';

class OVNApiService {
  loadHistoricalData() {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/v2/cryptocurrency/quotes/historical`;
      const params = {
        symbol: 'OVN',
        interval: '2d',
      };

      const headers = {
        'X-CMC_PRO_API_KEY': API_KEY,
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
}

export default new OVNApiService();

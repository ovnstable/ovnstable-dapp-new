/* eslint-disable class-methods-use-this */
import axios from 'axios';

const API_CORS = 'https://proxy.cors.sh/';
const API_URL = 'https://pro-api.coinmarketcap.com/v2';
const API_KEY = 'dde601e1-d49d-4320-8546-8efacdd506cd';

class OVNApiService {
  loadHistoricalData() {
    return new Promise((resolve, reject) => {
      const url = `${API_CORS}${API_URL}/cryptocurrency/quotes/historical`;
      const params = {
        symbol: 'OVN',
        interval: '2d',
      };

      const headers = {
        'x-cors-api-key': 'temp_a55e00c15c4a23c7dadf8a29216a9121',
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

  loadPrice() {
    return new Promise((resolve, reject) => {
      const url = `${API_CORS}${API_URL}/cryptocurrency/quotes/latest`;
      const params = {
        symbol: 'OVN',
      };

      const headers = {
        'x-cors-api-key': 'temp_a55e00c15c4a23c7dadf8a29216a9121',
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

  loadMK() {
    return new Promise((resolve, reject) => {
      const url = `${API_CORS}${API_URL}/cryptocurrency/ohlcv/latest`;
      const params = {
        symbol: 'OVN',
      };

      const headers = {
        'x-cors-api-key': 'temp_a55e00c15c4a23c7dadf8a29216a9121',
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

/* eslint-disable class-methods-use-this */
import apiService from './api-service.ts';

const API_URL = 'https://api.overnight.fi/root/';

class SliderApiService {
  loadApyName(): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}landing/main-widget/data`;
      apiService.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  loadTVL(): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}tvl/product/total`;
      apiService.get(url)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

export default new SliderApiService();

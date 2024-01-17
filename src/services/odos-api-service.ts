/* eslint-disable class-methods-use-this */
import { getErrorObject } from '@/utils/errors.ts';
import apiService from './api-service.ts';

const API_URL = 'https://api.overnight.fi/root/odos';

class OdosApiService {
  loadChains() {
    return new Promise((resolve, reject) => {
      apiService.get(`${API_URL}/info/chains`)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadTokens() {
    return new Promise((resolve, reject) => {
      apiService.get(`${API_URL}/info/tokens`)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  async loadContractData(chainId: string | number): Promise<any> {
    return new Promise((resolve, reject) => {
      apiService.get(`${API_URL}/info/contract-info/v2/${chainId}`)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadPrices(chainId: any) {
    return new Promise((resolve, reject) => {
      apiService.get(`${API_URL}/pricing/token/${chainId}`)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  getActualGasPrice(chainId: any) {
    return new Promise((resolve, reject) => {
      apiService.get(`${API_URL}/gas/price/${chainId}`)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  quoteRequest(requestData: any) {
    return new Promise((resolve, reject) => {
      apiService.postJson(`${API_URL}/sor/quote/v2`, requestData)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  assembleRequest(requestData: any) {
    return new Promise((resolve, reject) => {
      apiService.postJson(`${API_URL}/sor/assemble`, requestData)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  swapRequest(requestData: any) {
    return new Promise((resolve, reject) => {
      apiService.postJson(`${API_URL}/sor/swap`, requestData)
        .then((data) => {
          resolve(data);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }
}
export default new OdosApiService();

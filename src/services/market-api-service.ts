/* eslint-disable class-methods-use-this */
import { type Strategy, type Payout, type Collateral } from '@/utils/market-token-data.ts';
import { getErrorObject } from '@/utils/errors.ts';
import apiService from './api-service.ts';

const API_URL = 'https://api.overnight.fi';

class MarketApiService {
  loadStrategies(chain: string, token: string): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/${chain}/${token}/dapp/strategies`;
      apiService.get(url)
        .then((response: any) => {
          const strategies = response as Strategy[];
          resolve(strategies as Strategy[]);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadPayouts(chain: string, token: string): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/${chain}/${token}/dapp/payouts`;
      apiService.get(url)
        .then((response: any) => {
          const payouts = response as Payout[];
          resolve(payouts as Payout[]);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadTotalPlusToken(chain: string, token: string): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/${chain}/${token}/dapp/getTotalUsdPlusValue`;
      apiService.get(url)
        .then((response: any) => {
          const totalVal = response as number;
          resolve(totalVal as number);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }

  loadCollaterlPlusToken(chain: string, token: string): any {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/${chain}/${token}/dapp/collateral/total`;
      apiService.get(url)
        .then((response: any) => {
          const collaterals = response as Collateral[];
          resolve(collaterals as Collateral[]);
        })
        .catch((e) => {
          reject(getErrorObject(e));
        });
    });
  }
}

export default new MarketApiService();

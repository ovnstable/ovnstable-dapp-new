import ApiService from '@/services/ApiService/ApiService.ts';

const API_CORS = 'https://proxy.cors.sh/';
const API_URL = 'https://pro-api.coinmarketcap.com/v2';

interface IExternalApiService {
  loadPrice(): Promise<any>;
  loadTVLOVN(
    chainScan: string, poolAddress: string, ovnAddress: string, apiKey: string
  ): Promise<any>;
}

class ExternalApi extends ApiService implements IExternalApiService {
  async loadPrice(): Promise<any> {
    const url = `${API_CORS}${API_URL}/cryptocurrency/quotes/latest`;
    const params = { symbol: 'OVN' };
    const headers = {
      'x-cors-api-key': import.meta.env.VITE_APP_API_KEY_X_CORS,
      'X-CMC_PRO_API_KEY': import.meta.env.VITE_APP_API_KEY_CMC,
    };
    return this.get(url, { params, headers });
  }

  async loadTVLOVN(
    chainScan: string,
    poolAddress: string,
    ovnAddress: string,
    apiKey: string,
  ): Promise<any> {
    return this.get(`${chainScan}/api?module=account&action=tokenbalance&contractaddress=${ovnAddress.toLowerCase()}&address=${poolAddress.toLowerCase()}&tag=latest&apikey=${apiKey}`);
  }
}

export default ExternalApi;

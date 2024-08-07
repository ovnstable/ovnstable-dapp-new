import { ApiService } from './api-service.ts';

const API_URL = 'https://bsc.overnight.fi/api/odos';

class OdosApiService extends ApiService {
  public async loadChains() {
    return this.get(`${API_URL}/info/chains`);
  }

  public async loadTokens() {
    return this.get(`${API_URL}/info/tokens`);
  }

  public async loadContractData(chainId: string | number) {
    return this.get(`${API_URL}/info/contract-info/v2/${chainId}`);
  }

  public async loadPrices(chainId: any) {
    return this.get(`${API_URL}/pricing/token/${chainId}`);
  }

  public async loadPriceOfToken(chainId: any, tokenAddr: any) {
    return this.get(`${API_URL}/pricing/token/${chainId}/${tokenAddr}`);
  }

  public async getActualGasPrice(chainId: any) {
    return this.get(`${API_URL}/gas/price/${chainId}`);
  }

  public async quoteRequest(requestData: any) {
    return this.postJson(`${API_URL}/sor/quote/v2`, requestData);
  }

  public async assembleRequest(requestData: any) {
    return this.postJson(`${API_URL}/sor/assemble`, requestData);
  }

  public async swapRequest(requestData: any) {
    return this.postJson(`${API_URL}/sor/swap`, requestData);
  }
}
export default new OdosApiService();

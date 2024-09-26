import ApiService from '@/services/ApiService/ApiService.ts';
import type {
  IInsPayoutResponse, IInsPayoutResponseOld, IInsStatResponse, IStrategyResponse,
  IStrategyResponseOld,
} from '@/types/api/overnightApi';
import type { TFilterPoolsParams } from '@/types/common/pools';
import { tranformPayoutResponse, tranformStrategyResponse } from './utils/apiComatibility.ts';

const API_URL = process.env.OVERNIGHT_API_URL;
const API_URL_NEW = process.env.OVERNIGHT_API_URL_NEW;
const OVERNIGHT_POOLS_API_URL = process.env!.OVERNIGHT_POOLS_API_URL as string;
const API_URL_ODOS = `${API_URL}/root/odos`;

export interface IOvernightApi {
  // Slider
  loadApyName(): any,
  loadTVL(): any

  // Odos
  loadTokens(): any,
  loadContractData(chainId: string | number): any,
  loadPrices(chainId: any): any,
  loadPriceOfToken(chainId: any, tokenAddr: any): any,
  getActualGasPrice(chainId: any): any,
  quoteRequest(requestData: any): any,
  assembleRequest(requestData: any): any,
  swapRequest(requestData: any): any,

  // Market
  loadStrategies(): Promise<IStrategyResponseOld[]>,
  loadPayouts(chain: string, token: string): any,
  loadTotalPlusToken(chain: string, token: string): any,
  loadCollaterlPlusToken(chain: string, token: string): any,

  // Insurance
  loadInsuranceData(): Promise<IInsStatResponse>,
  loadOvnPrice(): any,
  loadInsurancePayouts(): Promise<IInsPayoutResponseOld[]>,

  // Dashboard
  loadBalanceChange(chain: string, token: string, address: string, dop?: string): any,

  // Pools

  // New API
  getFilteredPools(filterParams: Partial<TFilterPoolsParams>): any,
  getAllTokens(): any,
  // Old API
  getAllPools(apiUrl: string): any
}

export class OvernightApi extends ApiService implements IOvernightApi {
// Slider
  public async loadApyName() {
    return this.get(`${API_URL}/landing/main-widget/data`);
  }

  public async loadTVL() {
    return this.get(`${API_URL}/tvl/product/total`);
  }

  // Odos

  public async loadTokens() {
    return this.get(`${API_URL_ODOS}/info/tokens`);
  }

  public async loadContractData(chainId: string | number) {
    return this.get(`${API_URL_ODOS}/info/contract-info/v2/${chainId}`);
  }

  public async loadPrices(chainId: any) {
    return this.get(`${API_URL_ODOS}/pricing/token/${chainId}`);
  }

  public async loadPriceOfToken(chainId: any, tokenAddr: any) {
    return this.get(`${API_URL_ODOS}/pricing/token/${chainId}/${tokenAddr}`);
  }

  public async getActualGasPrice(chainId: any) {
    return this.get(`${API_URL_ODOS}/gas/price/${chainId}`);
  }

  public async quoteRequest(requestData: any) {
    return this.post(`${API_URL_ODOS}/sor/quote/v2`, requestData);
  }

  public async assembleRequest(requestData: any) {
    return this.post(`${API_URL_ODOS}/sor/assemble`, requestData);
  }

  public async swapRequest(requestData: any) {
    return this.post(`${API_URL_ODOS}/sor/swap`, requestData);
  }

  // Market

  public async loadStrategies(): Promise<IStrategyResponseOld[]> {
    return tranformStrategyResponse(this.get<IStrategyResponse[]>(`${API_URL_NEW}/strategy/arbitrum/USD+/list`));
  }

  public async loadPayouts(chain: string) {
    return this.get(`${API_URL_NEW}/insurance/${chain}`);
  }

  public async loadTotalPlusToken(chain: string, token: string) {
    return this.get(`${API_URL}/${chain}/${token}/dapp/getTotalUsdPlusValue`);
  }

  public async loadCollaterlPlusToken(chain: string, token: string) {
    return this.get(`${API_URL}/${chain}/${token}/dapp/collateral/total`);
  }

  // Insurance

  public async loadInsuranceData(): Promise<IInsStatResponse> {
    return this.get(`${API_URL_NEW}/insurance/arbitrum/stats`);
  }

  public async loadOvnPrice() {
    return this.get(`${API_URL}/root/dapp/price/ovn`);
  }

  public async loadInsurancePayouts(): Promise<IInsPayoutResponseOld[]> {
    return tranformPayoutResponse(this.get<IInsPayoutResponse[]>(`${API_URL_NEW}/insurance/arbitrum`));
  }

  // Dashboard

  public async loadBalanceChange(chain: string, token: string, address: string, dop?: string) {
    const dopSegment = dop ? `&product=${encodeURIComponent(`${dop}+`)}` : '';
    return this.get(`${API_URL}/${chain}/${token}/dapp/clientBalanceChanges?address=${address}${dopSegment}`);
  }

  // Pools

  // New API
  public async getFilteredPools(filterParams: Partial<TFilterPoolsParams>) {
    return this.get(`${OVERNIGHT_POOLS_API_URL}/pools`, filterParams);
  }

  public async getAllTokens() {
    return this.get(`${OVERNIGHT_POOLS_API_URL}/tokens`);
  }

  // Old API
  public async getAllPools(url: string) {
    return this.get(`${url}/pools/all`);
  }
}

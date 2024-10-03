/* eslint-disable vue/max-len */
import ApiService from '@/services/ApiService/ApiService.ts';
import type { Collateral } from '@/modules/Market/types/index.ts';
import type {
  IClientBalanceChangeResponseOld,
  IInsPayoutResponseOld, IInsStatResponse,
  IOdosTokenPriceResponse,
  IPayoutResponseOld,
  IStatTvlResponse,
  IStrategyResponseOld,
  IWidgetDataResponse,
} from '@/types/api/overnightApi';
import type { TFilterPoolsParams } from '@/types/common/pools';
import {
  tranformClientBalanceChangeResponse,
  tranformInsPayoutResponse, tranformPayoutResponse,
  tranformStrategyResponse,
} from './utils/apiComatibility.ts';

const API_URL = process.env.OVERNIGHT_API_URL;
const API_URL_NEW = process.env.OVERNIGHT_API_URL_NEW;
const OVERNIGHT_POOLS_API_URL = process.env!.OVERNIGHT_POOLS_API_URL as string;
const API_URL_ODOS_NEW = `${API_URL_NEW}/odos`;

export interface IOvernightApi {
  // Slider
  loadWidgetData(): Promise<IWidgetDataResponse>,
  loadTVL(): Promise<IStatTvlResponse[]>,

  // Odos
  loadTokens(): any,
  loadContractData(chainId: string | number): any,
  loadPrices(chainId: any): any,
  loadPriceOfToken(chainId: any, tokenAddr: any): Promise<IOdosTokenPriceResponse>,
  getActualGasPrice(chainId: any): any,
  quoteRequest(requestData: any): any,
  assembleRequest(requestData: any): any,
  swapRequest(requestData: any): any,

  // Market
  loadStrategies(): Promise<IStrategyResponseOld[]>,
  loadPayouts(chain: string, token: string): any,
  loadTotalPlusToken(chain: string, token: string): Promise<number>,
  loadCollaterlPlusToken(chain: string, token: string): Promise<Collateral[]>,

  // Insurance
  loadInsuranceData(): Promise<IInsStatResponse>,
  loadInsurancePayouts(): Promise<IInsPayoutResponseOld[]>,

  // Dashboard
  loadBalanceChange(chain: string, token: string, address: string): Promise<IClientBalanceChangeResponseOld[]>,

  // Pools

  // New API
  getFilteredPools(filterParams: Partial<TFilterPoolsParams>): any,
  getAllTokens(): any,
  // Old API
  getAllPools(apiUrl: string): any
}

export class OvernightApi extends ApiService implements IOvernightApi {
// Slider
  public async loadWidgetData(): Promise<IWidgetDataResponse> {
    return this.get(`${API_URL_NEW}/stat/widget-data`);
  }

  public async loadTVL(): Promise<IStatTvlResponse[]> {
    return this.get(`${API_URL_NEW}/stat/tvl-data`);
  }

  // Odos

  public async loadTokens() {
    return this.get(`${API_URL_ODOS_NEW}/info/tokens`);
  }

  public async loadContractData(chainId: string | number) {
    return this.get(`${API_URL_ODOS_NEW}/info/contract-info/v2/${chainId}`);
  }

  public async loadPrices(chainId: any) {
    return this.get(`${API_URL_ODOS_NEW}/pricing/token/${chainId}`);
  }

  public async loadPriceOfToken(chainId: any, tokenAddr: any): Promise<IOdosTokenPriceResponse> {
    return this.get(`${API_URL_ODOS_NEW}/pricing/token/${chainId}/${tokenAddr}`);
  }

  public async getActualGasPrice(chainId: any) {
    return this.get(`${API_URL_ODOS_NEW}/gas/price/${chainId}`);
  }

  public async quoteRequest(requestData: any) {
    return this.post(`${API_URL_ODOS_NEW}/sor/quote/v2`, requestData);
  }

  public async assembleRequest(requestData: any) {
    return this.post(`${API_URL_ODOS_NEW}/sor/assemble`, requestData);
  }

  public async swapRequest(requestData: any) {
    return this.post(`${API_URL_ODOS_NEW}/sor/swap`, requestData);
  }

  // Market

  public async loadStrategies(): Promise<IStrategyResponseOld[]> {
    return tranformStrategyResponse(this.get(`${API_URL_NEW}/strategy/arbitrum/USD+/list`));
  }

  public async loadPayouts(chain: string): Promise<IPayoutResponseOld[]> {
    return tranformPayoutResponse(this.get(`${API_URL_NEW}/payout/${chain}/USD+`));
  }

  public async loadTotalPlusToken(chain: string, token: string): Promise<number> {
    return this.get(`${API_URL_NEW}/stat/${chain}/${token}/total-supply`);
  }

  public async loadCollaterlPlusToken(chain: string, token: string): Promise<Collateral[]> {
    return this.get(`${API_URL}/${chain}/${token}/dapp/collateral/total`);
  }

  // Insurance

  public async loadInsuranceData(): Promise<IInsStatResponse> {
    return this.get(`${API_URL_NEW}/insurance/arbitrum/stats`);
  }

  public async loadInsurancePayouts(): Promise<IInsPayoutResponseOld[]> {
    return tranformInsPayoutResponse(this.get(`${API_URL_NEW}/insurance/arbitrum`));
  }

  // Dashboard

  public async loadBalanceChange(chain: string, token: string, address: string): Promise<IClientBalanceChangeResponseOld[]> {
    return tranformClientBalanceChangeResponse(this.get(`${API_URL_NEW}/stat/client-balance/${chain}/${token.toUpperCase()}/${address}`));
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

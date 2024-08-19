import type { TFilterPoolsParams, TPool, TPoolInfo } from '@/types/common/pools/index.ts';
import { allNetworkConfigs } from '@/constants/networks/index.ts';
import PromisePool from '@supercharge/promise-pool';
// import { poolFilterParams } from './mockRequests.ts';
import { type IOvernightApi } from '../ApiService/OvernightApi.ts';
import { getFormatPools } from './utils/formatPools.ts';
import { getFilterDisplayedPools } from './utils/index.ts';
import { poolsFilter } from './utils/poolsFilter.ts';
import { ORDER_TYPE, poolsSort } from './utils/poolsSort.ts';
import { formatPools } from './utils/formatPoolsNew.ts';

export interface IPoolService {
  // Legacy API
  // getPoolsInfo(): Promise<TPoolInfo[]>;
  // getDisplayedPool(poolsList: TPoolInfo[], filterByTvl: boolean): TPoolInfo[],
  // filterPools(poolsList: TPoolInfo[], params: TFilterPoolsParams): TPoolInfo[],
  // sortPools(poolsList: TPoolInfo[], orderType: ORDER_TYPE, isDefaultOrder: boolean): TPoolInfo[],
  // New API
  getFilterPools(filterParams: TFilterPoolsParams): Promise<any>;
  sendMockRequest(): Promise<any>;
}

class PoolService implements IPoolService {
  private overnightApi: IOvernightApi;

  constructor(apiService: IOvernightApi) {
    this.overnightApi = apiService;
  }

  public async getPoolsInfo(): Promise<TPoolInfo[]> {
    const { errors, results } = await PromisePool
      .for(allNetworkConfigs)
      .process(async (networkConfig: any) => {
        const networkPools = await this.overnightApi.getAllPools(networkConfig.appApiUrl);
        return getFormatPools(networkPools, networkConfig);
      });

    if (errors.length === allNetworkConfigs.length) {
      // If all requests returned errors
      console.log(`Error get pools data: ${JSON.stringify(errors)}`);
    } else {
      // Else return something
      const poolsList = results.flat();
      return poolsList;
    }
    return [];
  }

  public static getDisplayedPool(poolsList: any, filterByTvl: boolean): any {
    return getFilterDisplayedPools(poolsList, filterByTvl);
  }

  public static filterPools(poolsList: any, params: any): any {
    return poolsFilter(poolsList, params);
  }

  public static sortPools(poolsList: any, orderType: ORDER_TYPE, isDefaultOrder: boolean) {
    return poolsSort(poolsList, orderType, isDefaultOrder);
  }

  // New pool API
  public async getFilterPools(filterParams: Partial<TFilterPoolsParams>): Promise<TPool[]> {
    const pools = await this.overnightApi.getFilteredPools(filterParams);
    try {
      const poolInfoList = await formatPools(pools);
      return poolInfoList;
    } catch (error) {
      console.error('Error formatting pools');
    }
    return [];
  }

  // Mock method, remove
  public async sendMockRequest() {
    return this.getFilterPools({});
  }
}

export default PoolService;

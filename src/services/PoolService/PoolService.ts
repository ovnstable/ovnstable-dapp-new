import PromisePool from '@supercharge/promise-pool';
import { poolApiService } from '@/services/pool-api-service.ts';
import { allNetworkConfigs } from '@/constants/networks/index.ts';
import type { TFilterPoolsParams, TPoolInfo } from '@/types/common/pools/index.ts';
import { getFormatPools } from './utils/formatPools.ts';
import { poolsFilter } from './utils/poolsFilter.ts';
import { getFilterDisplayedPools } from './utils/index.ts';
import { ORDER_TYPE, poolsSort } from './utils/poolsSort.ts';

class PoolService {
  public static async getPoolsInfo(): Promise<TPoolInfo[]> {
    const { errors, results } = await PromisePool
      .for(allNetworkConfigs)
      .process(async (networkConfig: any) => {
        const networkPools = await poolApiService.getAllPools(networkConfig.appApiUrl);
        return getFormatPools(networkPools, networkConfig);
      });

    if (errors.length === allNetworkConfigs.length) {
      // If all requests returned errors
      console.log(`Error get pools data: ${JSON.stringify(errors)}`);
    } else {
      // Else return something
      const poolsList = results.flat();
      console.log(poolsList);
      return poolsList;
    }
    return [];
  }

  public static getDisplayedPool(poolsList: TPoolInfo[], filterByTvl: boolean): TPoolInfo[] {
    return getFilterDisplayedPools(poolsList, filterByTvl);
  }

  public static filterPools(poolsList: TPoolInfo[], params: TFilterPoolsParams): TPoolInfo[] {
    return poolsFilter(poolsList, params);
  }

  public static sortPools(poolsList: TPoolInfo[], orderType: ORDER_TYPE, isDefaultOrder: boolean) {
    return poolsSort(poolsList, orderType, isDefaultOrder);
  }
}

export default PoolService;

import PromisePool from '@supercharge/promise-pool';
import { poolApiService } from '@/services/pool-api-service.ts';
import { allNetworkConfigs } from '@/constants/networks/index.ts';
import { getFormatPools } from './utils/index.ts';

class PoolService {
  public static async getPoolsInfo() {
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
      return poolsList;
    }
    return [];
  }
}

export default PoolService;

import PromisePool from '@supercharge/promise-pool';
import { poolApiService } from '@/services/pool-api-service.ts';
import { getFormatPools } from './utils/index.ts';

class PoolService {
  public static async getPoolsInfo(networksInfo: any) {
    const { errors, results } = await PromisePool
      .for(networksInfo)
      .process(async (networkConfig: any) => {
        const networkPools = await poolApiService.getAllPools(networkConfig.appApiUrl);
        return getFormatPools(networkPools, networkConfig);
      });

    if (errors.length > 0) {
      console.log(`Error get pools data: ${JSON.stringify(errors)}`);
    } else {
      const poolsList = results.flat();
      return poolsList;
    }
    return [];
  }
}

export default PoolService;

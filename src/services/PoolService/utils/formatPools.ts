/* eslint-disable import/prefer-default-export */
import { isArray } from 'lodash';
import {
  zapPlatformSupportList, HOT_POOLS, POOL_TAG, NEW_POOLS,
} from '@/store/views/main/pools/mocks.ts';
import { initAggregators } from '@/store/views/main/pools/helpers.ts';
import { poolTokensForZapMap } from '@/store/views/main/zapin/mocks.ts';
import { loadTokenImage } from '@/utils/tokenLogo.ts';

// TODO: check and remove unnecessary conditions
export const getFormatPools = async (data: any, networkConfig: any): Promise<[]> => {
  if (data) {
    const poolsList = data.map((poolInfo: any) => {
      let pool = poolInfo;

      let tokenNames = pool.id.name.split('/');
      let poolTag = null;

      if (pool?.id?.name === 'Convex USD+FRAXBP') {
        tokenNames = ['USD+', 'FRAX'];
        pool.id.name = 'USD+/FRAXBP';
      }

      const token0Icon = loadTokenImage(tokenNames[0]);
      const token1Icon = loadTokenImage(tokenNames[1]);
      const token2Icon = tokenNames[2] ? loadTokenImage(tokenNames[2]) : null;
      const token3Icon = tokenNames[3] ? loadTokenImage(tokenNames[3]) : null;

      if (
        pool
          && zapPlatformSupportList?.includes(pool.platform)
          && Object.keys(poolTokensForZapMap).some(
            (item) => item.toLowerCase() === pool.id.address.toLowerCase(),
          )
      ) {
        pool.zappable = true;
      }

      if (pool && pool?.tvl >= 0) {
        pool = initAggregators(pool);

        const newName = pool.id.name.toUpperCase();

        if (HOT_POOLS.includes(pool.id.address)) poolTag = POOL_TAG.HOT;
        if (NEW_POOLS.includes(pool.id.address)) poolTag = POOL_TAG.NEW;
        // if (LOW_TVL_PROMOTE.includes(pool.id.address)) poolTag = POOL_TAG.NEW;

        return {
          id: pool.id.name + pool.tvl + pool.platform,
          name: newName,
          token0Icon,
          token1Icon,
          token2Icon,
          token3Icon,
          poolVersion: pool.pool_version,
          chain: networkConfig.networkId,
          chainName: networkConfig.networkName,
          address: pool.id.address,
          platform: isArray(pool.platform) ? pool.platform : [pool.platform],
          tvl: pool.tvl,
          apr: pool.apr,
          poolTag,
          skimEnabled: pool.skimEnabled,
          explorerUrl: networkConfig.explorerUrl,
          zappable: pool.zappable,
          cardOpened: false,
          data: pool,
          aggregators: pool.aggregators,
          promoted: pool.promoted,
          poolNameForAgregator: pool.poolNameForAgregator,
          isOpened:
              !(pool.aggregators && pool.aggregators.length),
          stableFishUrl: null,
        };
      }

      return [];
    });

    return poolsList;
  }
  return [];
};

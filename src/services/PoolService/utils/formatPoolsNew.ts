/* eslint-disable import/prefer-default-export */
// import {
//   HOT_POOLS, POOL_TAG, NEW_POOLS,
// } from '@/store/views/main/pools/mocks.ts';
import { loadTokenImage } from '@/utils/tokenLogo.ts';
import type { TPool } from '@/types/common/pools';
import type { TPoolData } from '@/types/api/overnightApi';

export const formatPools = async (poolData: TPoolData[]): Promise<TPool[]> => {
  const poolsList = poolData.map((pool: TPoolData) => {
    const token0Icon = loadTokenImage(pool.token0.symbol).toString();
    const token1Icon = loadTokenImage(pool.token1.symbol).toString();

    // if (HOT_POOLS.includes(pool.poolAddress)) poolTag = POOL_TAG.HOT;
    // if (NEW_POOLS.includes(pool.poolAddress)) poolTag = POOL_TAG.NEW;

    return {
      id: pool.name + pool.tvl + pool.platform,
      name: pool.name.toUpperCase(),
      token0Icon,
      token1Icon,
      // Pool version not available
      poolVersion: '2',
      // Chain ID not available
      chain: 10,
      chainName: pool.chain,
      address: pool.poolAddress,
      platform: pool.platform,
      tvl: pool.tvl,
      poolTag: 'NEW',
      // Get explorer URL by platform
      explorerUrl: 'explorer_url',
      gauge: pool.gauge,
      fee: pool.fee,
      initPrice: pool.initPrice,
      price: pool.price,
      tickSpacing: pool.tickSpacing,
    };
  });

  return poolsList;
};

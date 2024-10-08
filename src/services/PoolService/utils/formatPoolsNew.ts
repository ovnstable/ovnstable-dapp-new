/* eslint-disable import/prefer-default-export */
import { loadEmptyImg, loadTokenImage } from '@/utils/tokenLogo.ts';
import type { TPool } from '@/types/common/pools';
import type { TPoolData } from '@/types/api/overnightApi';
import type { TTokenInfo } from '@/types/common/tokens';

export const formatPools = (
  poolData: TPoolData[],
  tokensData?:TTokenInfo[],
): TPool[] => {
  const tokenIconMap: {[key: string]: string} = tokensData!.reduce((acc, token) => (
    { ...acc, [token.address?.toLowerCase()]: token.logoUrl }
  ), {}) ?? [];

  const poolsList = poolData.map((pool: TPoolData) => ({
    id: pool.name + pool.tvl + pool.platform,
    name: pool.name.toUpperCase(),
    token0Icon: tokenIconMap[pool.token0.tokenId.toLowerCase()]
    ?? loadTokenImage(pool.token0.symbol)
       ?? loadEmptyImg(),
    token1Icon: tokenIconMap[pool.token1.tokenId.toLowerCase()]
    ?? loadTokenImage(pool.token1.symbol)
       ?? loadEmptyImg(),
    token0Add: pool?.token0?.tokenId ?? '',
    token1Add: pool?.token1?.tokenId ?? '',
    // Pool version not available
    poolVersion: `v${pool.poolVersion}`,
    // Chain ID not available
    chain: pool.chainId,
    chainName: pool.chainName,
    address: pool.poolAddress,
    platform: [pool.platform],
    tvl: pool.tvl,
    poolTag: 'NEW',
    // Get explorer URL by platform
    explorerUrl: 'explorer_url',
    gauge: pool.gauge,
    fee: pool.fee,
    initPrice: pool.initPrice,
    price: pool.price,
    tickSpacing: pool.tickSpacing,
  }));

  return poolsList;
};

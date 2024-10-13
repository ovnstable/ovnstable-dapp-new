import { POOL_WHITE_LIST, SECOND_MIN_AMOUNT } from '@/constants/pools/index.ts';
import { ALL_STABLE_TOKENS } from '@/store/views/main/pools/helpers';

export const getFilterDisplayedPools = (
  pools: any[],
  filterByTvl: boolean,
) => {
  const minTvl = filterByTvl ? SECOND_MIN_AMOUNT : 0;

  const displayedPools = pools.filter((pool) => {
    if (!!POOL_WHITE_LIST[pool?.address.toLowerCase()] || pool.tvl >= minTvl) return true;
    return false;
  });

  return displayedPools;
};

export const checkIsEveryStableToken = (tokenSymbols: string[]) => {
  if (tokenSymbols.every((id: string) => ALL_STABLE_TOKENS.includes(id.toUpperCase()))) return true;
  return false;
};

export const checkIsEveryStable = (pool: any) => {
  const poolTokens = pool.name.split('/');
  if (poolTokens.every((id: string) => ALL_STABLE_TOKENS.includes(id))) return true;
  return false;
};

export const checkIsUsdPlusStable = (pool: any) => {
  const poolTokens = pool.name.split('/');
  if (poolTokens.some((id: string) => ['USD+'].includes(id))) return true;
  return false;
};

export const checkIsOVNVolatile = (pool: any) => {
  const poolTokens = pool.name.split('/');
  if (poolTokens.some((id: string) => ['OVN'].includes(id))) return true;
  return false;
};

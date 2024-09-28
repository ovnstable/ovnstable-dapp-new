/* eslint-disable import/prefer-default-export */
import BN from 'bignumber.js';
import type { TTokenInfo } from '@/types/common/tokens/index.ts';

export const getTokenInfo = (
  address: string,
  tokenMap: Map<string, TTokenInfo>,
):TTokenInfo => tokenMap.get(address)!;

const getPercentage = (value: string, total: string) => new BN((value))
  .dividedBy(new BN(total)).multipliedBy(100).toFixed(0);

export const getPositionProportion = (
  token0UsdValue: string,
  token1UsdValue: string,
  totalUsdValue: string,
) => {
  const tokenProportions = {
    token0: '0',
    token1: '0',
  };
  if (Number(token0UsdValue) === 0) {
    tokenProportions.token1 = '100';
  } else if (Number(token1UsdValue) === 0) {
    tokenProportions.token0 = '100';
  } else {
    tokenProportions.token0 = getPercentage(token0UsdValue, totalUsdValue);
    tokenProportions.token1 = getPercentage(token1UsdValue, totalUsdValue);
  }
  return tokenProportions;
};

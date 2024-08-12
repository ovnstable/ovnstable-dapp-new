/* eslint-disable import/prefer-default-export */
import { POOL_TAG } from '@/constants/pools/index.ts';
import type { TPoolInfo } from '@/types/common/pools';

export enum ORDER_TYPE {
'TVL', 'TVL_UP', 'TVL_DOWN', 'APR', 'APR_UP', 'APR_DOWN'
}

export type TPoolsSort = (
    poolList: TPoolInfo[],
    orderType: ORDER_TYPE,
    isDefaultOrder: boolean
) => TPoolInfo[];

const sortByTagAndValue = (
  tag: POOL_TAG,
  pools: TPoolInfo[],
  isDefault: boolean = false,
) => (valueExtractor: any) => pools.sort(
  (a, b) => {
    if (isDefault) {
      if (a.poolTag === tag && b.poolTag !== tag) return -1;
      if (b.poolTag === tag && a.poolTag !== tag) return 1;
    }
    return valueExtractor(b) - valueExtractor(a);
  },
);

const orderTypeSortMap = {
  [ORDER_TYPE.APR_UP]: (pool: TPoolInfo) => pool.apr,
  [ORDER_TYPE.APR_DOWN]: (pool: TPoolInfo) => -pool.apr,
  [ORDER_TYPE.TVL_UP]: (pool: TPoolInfo) => pool.tvl,
  [ORDER_TYPE.TVL_DOWN]: (pool: TPoolInfo) => -pool.tvl,
};

export const poolsSort: TPoolsSort = (poolList, orderType, isDefaultOrder) => {
  const sortByHotTagAndValue = sortByTagAndValue(
    POOL_TAG.HOT,
    poolList,
    isDefaultOrder,
  );

  const sortFn = orderTypeSortMap[orderType as keyof typeof orderTypeSortMap] ?? null;

  return sortFn ? sortByHotTagAndValue(sortFn) : poolList;
};

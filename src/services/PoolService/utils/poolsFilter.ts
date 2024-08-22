/* eslint-disable import/prefer-default-export */
import { getNetworkParams } from '@/store/web3/network.ts';
import { POOL_CATEGORIES, type TFilterPoolsParams, type TPoolInfo } from '@/types/common/pools/index.ts';
import { checkIsUsdPlusStable, checkIsOVNVolatile, checkIsEveryStable } from '@/services/PoolService/utils/index.ts';

  enum SearchableProperties {
    name = 'name',
    id = 'id',
    chainName = 'chainName',
    address = 'address',
    platform = 'platform',
  }

type TPoolCategoryFilter = { [key: number]: (pool: TPoolInfo) => boolean, };
const poolCategoryFilterMap: TPoolCategoryFilter = {
  [POOL_CATEGORIES.V2]: (pool): boolean => pool?.poolVersion === 'v2',
  [POOL_CATEGORIES.V3]: (pool): boolean => pool?.poolVersion === 'v3',
  [POOL_CATEGORIES.TOKENPLUS]: (pool): boolean => checkIsUsdPlusStable(pool),
  [POOL_CATEGORIES.VOLATILE]: (pool): boolean => !checkIsEveryStable(pool),
  [POOL_CATEGORIES.STABLE]: (pool): boolean => checkIsEveryStable(pool),
  [POOL_CATEGORIES.OVN]: (pool): boolean => checkIsOVNVolatile(pool),
};

const searchPoolProperties = (pool: TPoolInfo, query: string) => Object
  .keys(SearchableProperties).some(
    (key: string) => pool[key as keyof typeof SearchableProperties]?.toString().toLowerCase()
      .includes(query) ?? false,
  );

const searchPoolByQuery = (pool: TPoolInfo, searchQuery: string): boolean => (
  searchQuery ? searchPoolProperties(pool, searchQuery.toLowerCase()) : true
);

const searchPoolByCategory = (
  pool: TPoolInfo,
  selectedCategory: POOL_CATEGORIES,
): boolean => (
  poolCategoryFilterMap[selectedCategory] ? poolCategoryFilterMap[selectedCategory](pool) : true
);

const filterByNetwork = (pool: TPoolInfo, selectedNetworkIds: number[]): boolean => (
  selectedNetworkIds.length > 0
    ? selectedNetworkIds.includes(getNetworkParams(pool.chainName).networkId)
    : true
);

export const poolsFilter = (poolsList: TPoolInfo[], params: any): TPoolInfo[] => {
  const filteredPools = poolsList.filter((pool: TPoolInfo) => (
    searchPoolByQuery(pool, params.searchQuery)
    && searchPoolByCategory(pool, params.category)
    && filterByNetwork(pool, params.chain)
  ));
  return filteredPools;
};

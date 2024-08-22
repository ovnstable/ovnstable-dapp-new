/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import { type IPoolService } from '@/services/PoolService/PoolService.ts';
import { computed, inject } from 'vue';
import type { ITokenService } from '@/services/TokenService/TokenService.ts';
import { useStore } from 'vuex';
import { useTokensQueryNew } from './useTokensQuery.ts';

export const usePoolsQuery = (poolService: IPoolService) => useQuery(
  {
    queryKey: ['pools'],
    queryFn: () => poolService.getPoolsInfo(),
    refetchInterval: false,
  },
);

export const usePoolsQueryNew = () => {
  const { state } = useStore();
  const filterParams = computed(() => state.poolsData.filterParams);

  const tokenService = inject('tokenService') as ITokenService;
  const poolService = inject('poolService') as IPoolService;

  const tokensQuery = useTokensQueryNew(tokenService, state);
  const poolsQuery = useQuery(
    {
      queryKey: ['allPools', filterParams],
      queryFn: async () => poolService.getFilterPools(filterParams.value),
      staleTime: 0,
      refetchInterval: false,
    },
  );

  const isAnyLoading = computed(() => tokensQuery.isLoading.value || poolsQuery.isLoading.value);
  const isAnyError = computed(() => tokensQuery.isError || poolsQuery.isError);
  const allErrors = computed(() => JSON.stringify([tokensQuery.error, poolsQuery.error]));
  const isAnyFetching = computed(() => tokensQuery.isFetching || poolsQuery.isFetching);

  const getTokenInfo = () => {
    const tokensData = tokensQuery.data.value;
    const poolsData = poolsQuery.data.value;
    const isLoaded = !isAnyLoading.value;

    if (isLoaded && tokensData && poolsData) {
      const pools = poolService.formatPoolInfo(poolsData, tokensData);
      return pools;
    }
    return [];
  };

  return {
    data: computed(getTokenInfo),
    error: allErrors,
    isFetching: isAnyFetching,
    isLoading: isAnyLoading,
    isError: isAnyError,
    isBalancesLoading: isAnyLoading,
  };
};

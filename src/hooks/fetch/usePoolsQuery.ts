/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import { type IPoolService } from '@/services/PoolService/PoolService.ts';
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import { useTokensQueryNew } from './useTokensQuery.ts';

export const usePoolsQuery = () => {
  const poolService = inject('poolService') as IPoolService;
  return useQuery(
    {
      queryKey: ['pools'],
      queryFn: () => poolService.getPoolsInfo(),
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );
};

export const usePoolsQueryNew = (param?: number) => {
  const { state } = useStore();
  const filterParams = computed(() => state.poolsData.filterParams);

  const poolService = inject('poolService') as IPoolService;

  const tokensQuery = useTokensQueryNew();
  const poolsQuery = useQuery(
    {
      queryKey: ['allPools', param ?? filterParams],
      queryFn: async () => poolService.getFilterPools(param ?? filterParams.value),
      staleTime: 0,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
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

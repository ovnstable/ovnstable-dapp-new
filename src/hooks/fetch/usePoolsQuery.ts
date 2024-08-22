/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import { type IPoolService } from '@/services/PoolService/PoolService.ts';
import { computed } from 'vue';

export const usePoolsQuery = (poolService: IPoolService) => useQuery(
  {
    queryKey: ['pools'],
    queryFn: () => poolService.getPoolsInfo(),
    refetchInterval: false,
  },
);

export const usePoolsQueryNew = (
  poolService: IPoolService,
  state: any,
) => {
  const filterParams = computed(() => state.poolsData.filterParams);
  return useQuery(
    {
      queryKey: ['allPools', filterParams],
      queryFn: () => poolService.getFilterPools(filterParams.value),
      staleTime: 0,
      refetchInterval: false,
    },
  );
};

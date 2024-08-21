/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import PoolService, { type IPoolService } from '@/services/PoolService/PoolService.ts';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';
import { computed } from 'vue';

export const usePoolsQuery = () => useQuery(
  {
    queryKey: ['pools'],
    queryFn: () => new PoolService(new OvernightApi()).getPoolsInfo(),
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
      queryKey: ['pools', filterParams],
      queryFn: () => poolService.getFilterPools(filterParams.value),
      staleTime: 0,
    },
  );
};

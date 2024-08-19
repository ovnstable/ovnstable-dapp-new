/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import PoolService, { type IPoolService } from '@/services/PoolService/PoolService.ts';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

export const usePoolsQuery = () => useQuery(
  {
    queryKey: ['pools'],
    queryFn: () => new PoolService(new OvernightApi()).getPoolsInfo(),
    refetchInterval: false,
  },
);

export const usePoolsQueryNew = (poolService: IPoolService) => useQuery(
  {
    queryKey: ['pools'],
    queryFn: () => poolService.sendMockRequest(),
    refetchInterval: false,
  },
);

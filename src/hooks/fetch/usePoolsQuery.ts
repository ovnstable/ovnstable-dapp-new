/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import PoolService from '@/services/PoolService/PoolService.ts';
import { OvernightApi } from '@/services/ApiService/OvernightApi.ts';

export const usePoolsQuery = () => useQuery(
  {
    queryKey: ['pools'],
    queryFn: () => new PoolService(new OvernightApi()).getPoolsInfo(),
    refetchInterval: false,
  },
);

export const usePoolsQueryNew = () => useQuery(
  {
    queryKey: ['pools'],
    queryFn: () => new PoolService(new OvernightApi()).sendMockRequest(),
    refetchInterval: false,
  },
);

/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import PoolService from '@/services/PoolService/PoolService.ts';

export const usePoolsQuery = () => useQuery(
  {
    queryKey: ['pools'],
    queryFn: PoolService.getPoolsInfo,
  },
);

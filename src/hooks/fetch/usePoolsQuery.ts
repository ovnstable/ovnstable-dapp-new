/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/vue-query';
import PoolService from '@/services/PoolService/PoolService.ts';

export const poolsQuery = () => useQuery(
  {
    queryKey: ['pools'],
    queryFn: PoolService.getPoolsInfo,
  },
);

/* eslint-disable import/prefer-default-export */

import type { TFilterPoolsParams } from '@/types/common/pools/index.ts';

// eslint-disable-next-line no-undef
export const poolFilterParams: Partial<TFilterPoolsParams> = {
  sort: 'desc',
  minTvl: '',
  protocol: ['aerodrome'],
  page: 1,
  limit: 100,
  chain: ['base'],
  token0: 'USDT',
};

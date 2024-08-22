/* eslint-disable import/prefer-default-export */

import type { TFilterPoolsParams } from '@/types/common/pools/index.ts';

// eslint-disable-next-line no-undef
export const poolFilterParams: Partial<TFilterPoolsParams> = {
  sort: '',
  minTvl: '',
  protocol: [''],
  page: '',
  limit: '',
  chain: [''],
  token0: '',
};

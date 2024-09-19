import { formatMoney, getFixed } from '@/utils/numbers.ts';
import BN from 'bignumber.js';

export const getOutputUsd = (outputUsd: string) => (new BN(outputUsd)
  .gt(0) ? formatMoney(outputUsd, getFixed(outputUsd)) : 0);

export const getTokenUsd = (val: any) => {
  if (new BN(val).eq(0)) return 0;
  const usdVal = new BN(val.sum ? val.sum : val.value)
    .times(val?.selectedToken?.price).toFixed();

  return formatMoney(usdVal, getFixed(usdVal));
};

export const getToken = (val: string) => {
  if (new BN(val).eq(0)) return 0;
  return formatMoney(val, getFixed(val));
};

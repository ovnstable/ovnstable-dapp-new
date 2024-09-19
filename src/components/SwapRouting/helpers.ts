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

export const getLiquiditySum = (tokens: any) => tokens
  .reduce((acc: any, curr: any) => acc
    .plus(new BN(curr.sum).times(curr.selectedToken?.price)), new BN(0)).toFixed();

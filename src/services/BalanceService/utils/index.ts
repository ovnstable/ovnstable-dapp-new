/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js';
import { OVN_TOKENS } from '@/utils/const.ts';
import type { TTokenInfo } from '@/types/common/tokens/index.ts';

export const getTotalUserBalance = (
  tokenList: TTokenInfo[],
  isOnlyOvn: boolean = false,
) => tokenList
  .reduce((acc: BigNumber, token: TTokenInfo) => (
    (!isOnlyOvn || OVN_TOKENS.includes(token.symbol))
      ? acc.plus(BigNumber(token.balanceData!.balanceInUsd))
      : acc
  ), new BigNumber(0));

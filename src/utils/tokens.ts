import BN from 'bignumber.js';
import type { ISuccessTokenData, ISuccessTokenInfo } from '@/types/common/tokens';

const DEFAULT_DECIMALS = 18;
const BN_STRING_BASE = 10;

export const getUsdStr = (
  val: string | number,
  decimals: number = DEFAULT_DECIMALS,
  usdValue: string | number = 1,
): string => new BN(val).div(10 ** decimals)
  .multipliedBy(new BN(usdValue)).toString(BN_STRING_BASE);

export const sumBnStr = (
  token0UsdStr: string,
  token1UsdStr: string,
): string => {
  const usdTotal = new BN(token0UsdStr).plus(new BN(token1UsdStr)).toString(BN_STRING_BASE);
  return usdTotal.toString();
};

export const getAllTokensString = (tokens: ISuccessTokenInfo[]) => tokens
  .map((token) => token.symbol).toString();

export const getTransactionTotal = (tokens:ISuccessTokenData[]): string => tokens.reduce((acc: string, token: ISuccessTokenData) => sumBnStr(acc, token.value), '0');

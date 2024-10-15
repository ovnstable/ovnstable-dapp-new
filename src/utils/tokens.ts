import BN from 'bignumber.js';
import { getPositionProportion } from '@/components/Pools/PositionsTable/helpers.ts';
import type {
  IInputTokenInfo, ISuccessTokenData, ISuccessTokenInfo, TInputToken,
} from '@/types/common/tokens/index.d.ts';
import { formatMoney } from './numbers.ts';

const DEFAULT_DECIMALS = 18;
const BN_STRING_BASE = 10;

export const getUsdStr = (
  val: string | number,
  decimals: number = DEFAULT_DECIMALS,
  usdPrice: string | number = 1,
): string => new BN(val).div(10 ** decimals)
  .multipliedBy(new BN(usdPrice)).toString(BN_STRING_BASE);

export const getUsdStrFromValue = (
  val: string | number,
  usdPrice: string | number = 1,
): string => new BN(val)
  .multipliedBy(new BN(usdPrice)).toString(BN_STRING_BASE);

export const sumBnStr = (
  token0UsdStr: string,
  token1UsdStr: string,
): string => {
  const usdTotal = new BN(token0UsdStr).plus(new BN(token1UsdStr)).toString(BN_STRING_BASE);
  return usdTotal.toString();
};

export const getAllTokensString = (tokens: ISuccessTokenInfo[]) => tokens
  .map((token) => token.symbol).toString();

export const getTransactionTotal = (tokens:ISuccessTokenData[]): string => tokens.reduce((acc: string, token: ISuccessTokenData) => sumBnStr(acc, token?.usdValue || token?.value || '0'), '0');

export const formatInputTokens = (tokens: TInputToken[]): IInputTokenInfo[] => {
  const tokensInfo = tokens
    .map((token) => {
      const usdValue = getUsdStrFromValue(token?.value, token.selectedToken?.price);

      return {
        ...token,
        usdValue: usdValue,
        displayedValue: formatMoney(token.value, 6),
        proportion: '',
      };
    });

  const proportion = Object.values(getPositionProportion(
    tokensInfo[0].usdValue,
    tokensInfo[1].usdValue,
    sumBnStr(tokensInfo[0].usdValue, tokensInfo[1].usdValue),
  ));

  return tokensInfo.map((token, n) => ({
    ...token,
    proportion: proportion[n],
  }));
};

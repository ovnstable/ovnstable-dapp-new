import { getAllTokensString, getUsdStrFromValue } from '@/utils/tokens.ts';
import { checkIsEveryStable } from '@/services/PoolService/utils/index.ts';
import type { TPool } from '@/types/common/pools';
import type { IPositionsInfo } from '@/types/positions';

export const getTxExplorerUrl = (explorerUrl: string, txHash: string) => `${explorerUrl}tx/${txHash || ''}`;
export const getSumTokens = (tokens: any[]) => (
  (tokens.length > 0)
    ? getAllTokensString(tokens.map((token: any) => token.selectedToken))
    : ''
);
export const getTokenType = (pool: TPool | IPositionsInfo) => (checkIsEveryStable(pool) ? 'Stable' : 'Volatile');

export const calculateTokenUsdValues = (tokens: any) => tokens.map((token: any) => ({
  ...token,
  usdValue: getUsdStrFromValue(token.value, token.price),
}));

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import BigNumber from 'bignumber.js';
import { getTokenByAddress } from '@/store/helpers/index.ts';
import type { TTokenInfo } from '@/types/common/tokens';

const DEFAULT_DECIMALS = 18;
const BN_STRING_BASE = 10;

type TPlatformLinkMap = {
    [key: string]: (address: string) => string,
}

export type TTokenDataList = {
    addresses: string[],
    amounts: number[],
}

export type TSuccessTokenInfo = {
    'id': string,
    'value': string,
    'usdValue': string,
    'contractValue': string,
    'selectedToken': TTokenInfo
};

type TAllTokenList = Map<string, TTokenInfo>;

export type TFormatTokenInfo = {
    id: string,
    symbol: string,
    value: string,
};

const platformLinkMap: TPlatformLinkMap = {
  Lynex: (address: string) => `https://app.lynex.fi/liquidity/manage/${address}`,
  Chronos: (address: string) => `https://app.chronos.exchange/liquidity/${address}`,
  Thena: (address: string) => `https://www.thena.fi/liquidity/manage/${address}`,
  Ramses: (address: string) => `https://app.ramses.exchange/liquidity/${address}`,
  Velodrome: (address: string) => 'https://velodrome.finance/dash',
  Aerodrome: (address: string) => 'https://aerodrome.finance/dash',
  Arbidex: (address: string) => 'https://arbidex.fi/xarxfarms',
  Baseswap: (address: string) => 'https://baseswap.fi/farms',
  Alienbase: (address: string) => 'https://app.alienbase.xyz/farms',
  Swapbased: (address: string) => 'https://swapbased.finance/#/farm',
  Velocimeter: (address: string) => 'https://base.velocimeter.xyz/liquidity',
  Sperax: (address: string) => `https://demeter.sperax.io/farm/42161/${address}`,
  Defiedge: (address: string) => `https://app.defiedge.io/s/optimism/${address}`,
  Convex: (address: string) => 'https://www.convexfinance.com/stake/arbitrum/13',
  Beefy: (address: string) => 'https://app.beefy.com/dashboard',
  Pancake: (address: string) => 'https://pancakeswap.finance/liquidity/?chain=arb',
  '0xb34a7d1444a707349Bc7b981B7F2E1f20F81F013': (address: string) => 'https://curve.fi/#/arbitrum/pools/factory-v2-117',
  '0x1446999B0b0E4f7aDA6Ee73f2Ae12a2cfdc5D9E7': (address: string) => 'https://curve.fi/#/arbitrum/pools/factory-stable-ng-15',
  Curve: (address: string) => 'https://curve.fi/#/base/pools/factory-v2-2/deposit',
};

export const getPlatformLink = (platform: string, address: string): string => {
  const platformLink = platformLinkMap[platform](address) ?? platformLinkMap[address](address) ?? '';

  if (platformLink === '') {
    console.error(
      'Open Position failed, dex not found.',
      platform,
    );
  }

  return platformLink;
};

const formatBN = (
  val: string | number,
  decimals: number = DEFAULT_DECIMALS,
): string => new BigNumber(val).div(10 ** decimals).toString(BN_STRING_BASE);

export const mapEventTokenData = (
  eventList: TTokenDataList,
  allTokenList: TTokenInfo[],
): TFormatTokenInfo[] => eventList.addresses
  .map((addr: string, index: number) => {
    const token = getTokenByAddress(addr.toString(), allTokenList);
    const value = formatBN(eventList.amounts[index], token?.decimals);
    return {
      id: `${token?.id}_return`,
      symbol: token?.symbol,
      value,
    };
  });

export const mapInputTokenData = (inputTokens: TSuccessTokenInfo[]) => inputTokens.map(
  (token: TSuccessTokenInfo) => ({
    id: `${token?.id}_return`,
    symbol: token.selectedToken.symbol,
    value: token.value,
  }),
);

export default getPlatformLink;

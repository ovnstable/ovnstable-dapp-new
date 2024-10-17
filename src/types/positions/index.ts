import type { TPoolInfo } from '@/types/common/pools';
import type { TTokenInfo } from '../common/tokens';

export type TPositionData = [
    platform: string,
    tokenId: number,
    poolId: string,
    token0: string,
    token1: string,
    amount0: number,
    amount1: number,
    rewardAmount0: number,
    rewardAmount1: number,
    emissions: number,
    tickLower: number,
    tickUpper: number,
    centerTick: number,
    isStaked: boolean,
  ]

export type TTicks = {
  tickLower: number,
  tickUpper: number,
  centerTick: number,
}

export type TPositionRewardTokenInfo = {
    value: string, usdValue: string, selectedToken: TTokenInfo
  }

export interface IPositionsInfo extends TPoolInfo {
  platformLinks: { platform: string, link: string }[],
  isStaked: boolean;
  gauge: string;
  position: {
    tokens:{ [key: string]: string }[],
    tokensOrig:{ [key: string]: string }[],
    displayedUsdValue: string,
    usdValue: string,
    tokenProportions: {
      token0: string,
      token1: string,
    },
    isInRange: boolean,
  },
  merkleData: {
    toClaim: string,
    rewardToken: any
  },
  emissionsUsd: string,
  emissions: number,
  token0Add: string,
  token1Add: string,
  rewards: {
    tokens: { [key: string]: string }[],
    tokensInfo: TPositionRewardTokenInfo[],
    displayedUsdValue: string,
    usdValue: string,
  },
  tokenId: number,
  ticks: TTicks,
  tokenNames: { [key: string]: string },
}

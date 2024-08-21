import type { TPoolInfo } from '@/types/common/pools';

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

export interface IPositionsInfo extends TPoolInfo {
  platformLinks: { platform: string, link: string }[],
  position: {
    tokens:{ [key: string]: string }[],
    displayedUsdValue: string,
    usdValue: string,
    tokenProportions: {
      token0: string,
      token1: string,
    },
    isInRange: boolean,
  },
  rewards: {
    tokens: { [key: string]: string }[],
    displayedUsdValue: string,
    usdValue: string,
  },
  tokenId: number,
  ticks: TTicks,
  tokenNames: { [key: string]: string },
}

/* eslint-disable import/prefer-default-export */
import BN from 'bignumber.js';
import { buildLink } from '@/store/views/main/pools/helpers.ts';
import { getUsdStr, sumBnStr } from '@/utils/tokens.ts';
import type { TTokenInfo } from '@/types/common/tokens/index.ts';
import type { IPositionsInfo, TPositionData, TTicks } from '@/types/positions/index.ts';
import type { TPoolInfo } from '@/types/common/pools/index.ts';

const AERO_ADDR = '0x940181a94A35A4569E4529A3CDfB74e38FD98631';
// const BN_USD_STRING_BASE = 2;

const getTokenNames = (poolName: string) => {
  const tokens = poolName.split('/');
  return {
    token0: tokens[0],
    token1: tokens[1],
  };
};

export const getTokenInfo = (
  address: string,
  tokenMap: Map<string, TTokenInfo>,
):TTokenInfo => tokenMap.get(address)!;

const getMinVal = (val: string | number) => (new BN(val).gt(0.1) ? new BN(val).toFixed(2) : '< 0.1');

export const isInRange = ({ tickLower, tickUpper, centerTick }: TTicks) => !(
  new BN(centerTick).gte(new BN(tickUpper)) || new BN(centerTick).lt(new BN(tickLower))
);

const getPercentage = (value: string, total: string) => new BN((value))
  .dividedBy(new BN(total)).multipliedBy(100).toFixed(0);

export const getPositionProportion = (
  token0UsdValue: string,
  token1UsdValue: string,
  totalUsdValue: string,
) => {
  const tokenProportions = {
    token0: '0',
    token1: '0',
  };
  if (Number(token0UsdValue) === 0) {
    tokenProportions.token1 = '100';
  } else if (Number(token1UsdValue) === 0) {
    tokenProportions.token0 = '100';
  } else {
    tokenProportions.token0 = getPercentage(token0UsdValue, totalUsdValue);
    tokenProportions.token1 = getPercentage(token1UsdValue, totalUsdValue);
  }
  return tokenProportions;
};

const getPlatformLinks = (
  platform: string,
  pool: TPoolInfo,
) => ([{
  platform,
  link: buildLink(pool, platform) ?? '',
}]);

export const formatPositionData = (
  posDataArr: TPositionData[],
  poolsMap: { [key: string]: TPoolInfo },
  tokenMap: Map<string, TTokenInfo>,
): IPositionsInfo[] => {
  const positionInfo = posDataArr.flatMap((
    [platform, tokenId, poolId, token0, token1, amount0, amount1, rewardAmount0, rewardAmount1,
      emissions, tickLower, tickUpper, centerTick, isStaked]: TPositionData,
  ) => {
    // Pools
    const pool = poolsMap[poolId]
    ?? poolsMap[poolId.toUpperCase()] ?? poolsMap[poolId.toLowerCase()];

    // console.log('__1');

    if (pool && pool.name && isStaked) {
      // Tokens
      const tokenNames = getTokenNames(pool.name);
      const token0Info = getTokenInfo(token0, tokenMap);
      const token1Info = getTokenInfo(token1, tokenMap);

      // Token usd values
      const token0UsdStr = getUsdStr(amount0, token0Info?.decimals, token0Info?.price);
      const token1UsdStr = getUsdStr(amount1, token1Info?.decimals, token1Info?.price);
      const reward0UsdStr = getUsdStr(rewardAmount0, token0Info?.decimals, token0Info?.price);
      const reward1UsdStr = getUsdStr(rewardAmount1, token1Info?.decimals, token1Info?.price);
      const positionUsdTotal = sumBnStr(token0UsdStr, token1UsdStr);
      let rewardUsdTotal = sumBnStr(reward0UsdStr, reward1UsdStr);

      if (platform === 'Aerodrome') {
        const aeroTokenInfo = getTokenInfo(AERO_ADDR, tokenMap);
        rewardUsdTotal = getUsdStr(emissions, aeroTokenInfo?.decimals, aeroTokenInfo?.price);
      }

      // Ticks
      const ticks = {
        tickLower,
        tickUpper,
        centerTick,
      };

      // console.log(ticks, '__ticks');

      // Final data
      const positionFullInfo = {
        ...pool,
        position: {
          tokens: [
            { [tokenNames.token0]: getUsdStr(amount0, token0Info?.decimals) },
            { [tokenNames.token1]: getUsdStr(amount1, token1Info?.decimals) },
          ],
          usdValue: positionUsdTotal,
          displayedUsdValue: getMinVal(positionUsdTotal),
          tokenProportions: getPositionProportion(token0UsdStr, token1UsdStr, positionUsdTotal),
          isInRange: isInRange(ticks),
        },
        rewards: {
          tokens: [
            { [tokenNames.token0]: getUsdStr(rewardAmount0, token0Info?.decimals) },
            { [tokenNames.token1]: getUsdStr(rewardAmount1, token1Info?.decimals) },
          ],
          usdValue: rewardUsdTotal,
          displayedUsdValue: getMinVal(rewardUsdTotal),
        },
        emissions,
        platformLinks: getPlatformLinks(pool.platform, pool),
        tokenId,
        ticks,
        tokenNames,
        isStaked,
      };

      // console.log(positionFullInfo, '__positionFullInfo');

      return positionFullInfo;
    }
    return [];
  });

  // console.log(positionInfo, '__positionInfo');
  return positionInfo;
};

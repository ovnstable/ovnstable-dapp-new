/* eslint-disable import/prefer-default-export */
import BN from 'bignumber.js';
import { buildLink } from '@/store/views/main/pools/helpers.ts';
import { getUsdStr, sumBnStr } from '@/utils/tokens.ts';
import { loadEmptyImg } from '@/utils/tokenLogo.ts';
import { getNetworkParams } from '@/store/web3/network.ts';
import type { TPoolInfo } from '@/types/common/pools';
import type { TTokenInfo } from '@/types/common/tokens';
import type { IPositionsInfo, TPositionData, TTicks } from '@/types/positions';

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
):TTokenInfo => tokenMap.get(address?.toLowerCase())!;

const getMinVal = (val: string | number) => (new BN(val).gt(0.1) ? new BN(val).toFixed(2) : '< 0.1');

export const isInRange = ({ tickLower, tickUpper, centerTick }: TTicks) => {
  if (new BN(centerTick).lt(0)) {
    return (
      new BN(centerTick)
        .lte(new BN(tickUpper)) && new BN(centerTick).gte(new BN(tickLower))
    );
  }

  return (
    new BN(centerTick)
      .lte(new BN(tickUpper)) && new BN(centerTick).gte(new BN(tickLower))
  );
};

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
  address: string,
  chain: string,
) => ([{
  platform,
  link: buildLink({
    address,
    chainName: chain,
  }, platform) ?? '',
}]);

export const formatPositionData = (
  posDataArr: TPositionData[],
  poolsMap: { [key: string]: TPoolInfo },
  tokenMap: Map<string, TTokenInfo>,
  networkId: number,
): IPositionsInfo[] => {
  const positionInfo = posDataArr.flatMap((
    [platform, tokenId, poolId, token0, token1, amount0, amount1, rewardAmount0, rewardAmount1,
      emissions, tickLower, tickUpper, centerTick, isStaked]: TPositionData,
  ) => {
    // Pools
    const network = getNetworkParams(networkId);
    const pool = poolsMap[poolId]
    ?? poolsMap[poolId.toUpperCase()] ?? poolsMap[poolId.toLowerCase()];

    if (isStaked) {
      // Tokens
      const token0Info = getTokenInfo(token0, tokenMap);
      const token1Info = getTokenInfo(token1, tokenMap);
      const tokenNames = pool ? getTokenNames(pool.name) : {
        token0: token0Info?.symbol,
        token1: token1Info?.symbol,
      };

      // Token usd values
      const token0UsdStr = getUsdStr(amount0, token0Info?.decimals, token0Info?.price);
      const token1UsdStr = getUsdStr(amount1, token1Info?.decimals, token1Info?.price);
      const reward0Str = getUsdStr(rewardAmount0, token0Info?.decimals);
      const reward1Str = getUsdStr(rewardAmount1, token1Info?.decimals);
      const reward0UsdStr = getUsdStr(rewardAmount0, token0Info?.decimals, token0Info?.price);
      const reward1UsdStr = getUsdStr(rewardAmount1, token1Info?.decimals, token1Info?.price);
      const positionUsdTotal = sumBnStr(token0UsdStr, token1UsdStr);
      let rewardUsdTotal = sumBnStr(reward0UsdStr, reward1UsdStr);
      let platformName = platform;
      let rewardTokensInfo;

      if (platformName === 'PCS') platformName = 'Pancake';
      if (platform === 'Aerodrome') {
        const aeroTokenInfo = getTokenInfo(AERO_ADDR, tokenMap);
        rewardUsdTotal = getUsdStr(emissions, aeroTokenInfo?.decimals, aeroTokenInfo?.price);
        rewardTokensInfo = [
          {
            id: aeroTokenInfo.id,
            symbol: aeroTokenInfo.symbol,
            value: getUsdStr(emissions, aeroTokenInfo?.decimals),
            usdValue: getUsdStr(emissions, aeroTokenInfo?.decimals, aeroTokenInfo?.price),
            selectedToken: aeroTokenInfo,
          },
        ];
      }

      // Ticks
      const ticks = {
        tickLower,
        tickUpper,
        centerTick,
      };

      // Final data
      const positionFullInfo = {
        ...pool,
        address: poolId,
        chain: networkId,
        token0Add: token0Info?.address,
        token1Add: token1Info?.address,
        chainName: network?.networkName?.toLowerCase(),
        token0Icon: token0Info?.logoUrl ?? loadEmptyImg(),
        token1Icon: token1Info?.logoUrl ?? loadEmptyImg(),
        platform: [platformName],
        name: pool ? pool.name : `${token0Info?.symbol}/${token1Info?.symbol}`,
        position: {
          tokens: [
            { [tokenNames.token0]: getUsdStr(amount0, token0Info?.decimals) },
            { [tokenNames.token1]: getUsdStr(amount1, token1Info?.decimals) },
          ],
          tokensOrig: [
            { [tokenNames.token0]: amount0.toString() },
            { [tokenNames.token1]: amount1.toString() },
          ],
          usdValue: positionUsdTotal,
          displayedUsdValue: getMinVal(positionUsdTotal),
          tokenProportions: getPositionProportion(token0UsdStr, token1UsdStr, positionUsdTotal),
          isInRange: isInRange(ticks),
        },
        rewards: {
          tokens: [
            { [tokenNames.token0]: reward0Str },
            { [tokenNames.token1]: reward1Str },
          ],
          tokensInfo: rewardTokensInfo || [],
          usdValue: rewardUsdTotal,
          displayedUsdValue: getMinVal(rewardUsdTotal),
        },
        emissions,
        platformLinks: getPlatformLinks(platformName, poolId, network?.networkName?.toLowerCase()),
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

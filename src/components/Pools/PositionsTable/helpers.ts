import BN from 'bignumber.js';
import { buildLink } from '@/store/views/main/pools/helpers.ts';

const DEFAULT_DECIMALS = 18;
const BN_STRING_BASE = 10;
const AERO_ADDR = '0x940181a94A35A4569E4529A3CDfB74e38FD98631';
// const BN_USD_STRING_BASE = 2;

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
  ]

type TPoolInfo = {
    id: string,
    name: string,
    token0Icon: string,
    token1Icon: string,
    token2Icon: null | string,
    token3Icon: null | string,
    poolVersion: string,
    chain: number,
    chainName: string,
    address: string,
    platform: string[],
    tvl: number,
    apr: number,
    poolTag: null | string,
    skimEnabled: boolean,
    explorerUrl: string,
    zappable: boolean,
    cardOpened: boolean,
    data: {
        id: {
            name: string,
            address: string,
            chain: string
        },
        platform: string,
        tvl: number,
        apr: number,
        pool_version: string,
        updateDate: string,
        addToSync: boolean,
        skimEnabled: boolean,
        promoted: boolean,
        transfersSyncEnabled: boolean,
        skimUpdateDate: null | string,
        zappable: boolean,
        aggregators: string[]
    },
    aggregators: [],
    promoted: false,
    isOpened: true,
    stableFishUrl: null
}

type TSelectedTokenInfo = {
    id: string,
    address: string,
    decimals: number,
    assetType: string,
    name: string,
    symbol: string,
    logoUrl: string,
    selected: false,
    balanceData: {
      name: string,
      balance: string,
      balanceInUsd: string,
      originalBalance: string,
      decimal: number,
    },
    approveData: {
      allowanceValue: number,
      approved: false,
    },
    price: string,
}

// type TTokenInfo = {
//     'id': string,
//     'value': string,
//     'usdValue': string,
//     'contractValue': string,
//     'selectedToken': TSelectedTokenInfo
// };

type TTicks = {
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

const formatBN = (
  val: string | number,
  decimals: number = DEFAULT_DECIMALS,
  usdValue: string | number = 1,
): string => new BN(val).div(10 ** decimals)
  .multipliedBy(new BN(usdValue)).toString(BN_STRING_BASE);

const getTokenNames = (poolName: string) => {
  const tokens = poolName.split('/');
  return {
    token0: tokens[0],
    token1: tokens[1],
  };
};

const getTokenInfo = (
  address: string,
  tokenMap: Map<string, TSelectedTokenInfo>,
):TSelectedTokenInfo => tokenMap.get(address)!;

const sumBnStr = (
  token0UsdStr: string,
  token1UsdStr: string,
): string => {
  const usdTotal = new BN(token0UsdStr).plus(new BN(token1UsdStr)).toString(BN_STRING_BASE);
  return usdTotal.toString();
};

const getMinVal = (val: string | number) => (new BN(val).gt(0.1) ? new BN(val).toFixed(2) : '< 0.1');

const isInRange = ({ tickLower, tickUpper, centerTick }: TTicks) => !(
  new BN(centerTick).gte(new BN(tickUpper)) || new BN(centerTick).lt(new BN(tickLower))
);

const getPercentage = (value: string, total: string) => new BN((value))
  .dividedBy(new BN(total)).multipliedBy(100).toFixed(2);

const getPositionProportion = (
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
  platforms: string[],
  pool: TPoolInfo,
) => platforms.map((platform: string) => ({
  platform,
  link: buildLink(pool, platform) ?? '',
}));

export const formatPositionData = (
  posDataArr: TPositionData[],
  poolsMap: { [key: string]: TPoolInfo },
  tokenMap: Map<string, TSelectedTokenInfo>,
): IPositionsInfo[] => {
  const positionInfo = posDataArr.map((
    [platform, tokenId, poolId, token0, token1, amount0, amount1, rewardAmount0, rewardAmount1,
      emissions, tickLower, tickUpper, centerTick]: TPositionData,
  ) => {
    // Pools
    const pool = poolsMap[poolId]
    ?? poolsMap[poolId.toUpperCase()] ?? poolsMap[poolId.toLowerCase()];

    // Tokens
    const tokenNames = getTokenNames(pool.name);
    const token0Info = getTokenInfo(token0, tokenMap);
    const token1Info = getTokenInfo(token1, tokenMap);
    // Token usd values
    const token0UsdStr = formatBN(amount0, token0Info!.decimals, token0Info.price);
    const token1UsdStr = formatBN(amount1, token1Info!.decimals, token1Info.price);
    const reward0UsdStr = formatBN(rewardAmount0, token0Info!.decimals, token0Info.price);
    const reward1UsdStr = formatBN(rewardAmount1, token1Info!.decimals, token1Info.price);
    const positionUsdTotal = sumBnStr(token0UsdStr, token1UsdStr);
    let rewardUsdTotal = sumBnStr(reward0UsdStr, reward1UsdStr);

    if (platform === 'Aerodrome') {
      const aeroTokenInfo = getTokenInfo(AERO_ADDR, tokenMap);
      const emissionsUsdVal = formatBN(emissions, aeroTokenInfo!.decimals, aeroTokenInfo.price);
      rewardUsdTotal = sumBnStr(rewardUsdTotal, emissionsUsdVal);
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
      position: {
        tokens: [
          { [tokenNames.token0]: formatBN(amount0, token0Info!.decimals) },
          { [tokenNames.token1]: formatBN(amount1, token1Info!.decimals) },
        ],
        usdValue: positionUsdTotal,
        displayedUsdValue: getMinVal(positionUsdTotal),
        tokenProportions: getPositionProportion(token0UsdStr, token1UsdStr, positionUsdTotal),
        isInRange: isInRange(ticks),
      },
      rewards: {
        tokens: [
          { [tokenNames.token0]: formatBN(rewardAmount0, token0Info!.decimals) },
          { [tokenNames.token1]: formatBN(rewardAmount1, token1Info!.decimals) },
        ],
        usdValue: rewardUsdTotal,
        displayedUsdValue: getMinVal(rewardUsdTotal),
      },
      platformLinks: getPlatformLinks(pool.platform, pool),
      tokenId,
      ticks,
      tokenNames,
    };
    return positionFullInfo;
  });
  return positionInfo;
};

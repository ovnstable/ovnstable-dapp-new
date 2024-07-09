import BN, { BigNumber } from 'bignumber.js';

const DEFAULT_DECIMALS = 18;
const BN_STRING_BASE = 10;
const BN_USD_STRING_BASE = 2;

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
    tickLower: number,
    tickUpper: number,
    apr: BN,
  ]

type TPoolInfo = {
    'id': string,
    'name': string,
    'token0Icon': string,
    'token1Icon': string,
    'token2Icon': null | string,
    'token3Icon': null | string,
    'poolVersion': string,
    'chain': number,
    'chainName': string,
    'address': string,
    'platform': string[],
    'tvl': number,
    'apr': number,
    'poolTag': null | string,
    'skimEnabled': boolean,
    'explorerUrl': string,
    'zappable': boolean,
    'cardOpened': boolean,
    'data': {
        'id': {
            'name': string,
            'address': string,
            'chain': string
        },
        'platform': string,
        'tvl': number,
        'apr': number,
        'pool_version': string,
        'updateDate': string,
        'addToSync': boolean,
        'skimEnabled': boolean,
        'promoted': boolean,
        'transfersSyncEnabled': boolean,
        'skimUpdateDate': null | string,
        'zappable': boolean,
        'aggregators': string[]
    },
    'aggregators': [],
    'promoted': false,
    'isOpened': true,
    'stableFishUrl': null
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

type TTokenInfo = {
    'id': string,
    'value': string,
    'usdValue': string,
    'contractValue': string,
    'selectedToken': TSelectedTokenInfo
};

const formatBN = (
  val: string | number,
  decimals: number = DEFAULT_DECIMALS,
  usdValue: string | number = 1,
): string => new BigNumber(val).div(10 ** decimals).multipliedBy(usdValue).toString(BN_STRING_BASE);

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

const getUsdTotal = (
  token0Info: TSelectedTokenInfo,
  token1Info: TSelectedTokenInfo,
  token0Amount: number,
  token1Amount: number,
): string => {
  const token0UsdStr = formatBN(
    token0Amount,
    token0Info!.decimals,
    token0Info.price,
  );
  const token1UsdStr = formatBN(
    token1Amount,
    token1Info!.decimals,
    token1Info.price,
  );
  const usdTotal = new BN(token0UsdStr).plus(new BN(token1UsdStr)).toString(BN_USD_STRING_BASE);
  return usdTotal.toString();
};

export const formatPositionData = (
  posDataArr: TPositionData[],
  poolsMap: { [key: string]: TPoolInfo },
  tokenMap: Map<string, TSelectedTokenInfo>,
) => {
  // console.log(poolsMap);
  // console.log(tokenMap);
  const fPositions = posDataArr.map((
    [platform, tokenId, poolId, token0, token1, amount0, amount1, rewardAmount0, rewardAmount1,
      tickLower, tickUpper, apr]: TPositionData,
  ) => {
    const pool = poolsMap[poolId];
    const tokenNames = getTokenNames(pool.name);
    const token0Info = getTokenInfo(token0, tokenMap);
    const token1Info = getTokenInfo(token1, tokenMap);
    const positionFullInfo = {
      ...poolsMap[poolId],
      position: {
        tokens: [
          { [tokenNames.token0]: formatBN(amount0, token0Info!.decimals) },
          { [tokenNames.token1]: formatBN(amount1, token1Info!.decimals) },
        ],
        usdAmount: getUsdTotal(token0Info, token1Info, amount0, amount1),
      },
      rewards: {
        tokens: [
          { [tokenNames.token0]: formatBN(rewardAmount0, token0Info!.decimals) },
          { [tokenNames.token1]: formatBN(rewardAmount1, token1Info!.decimals) },
        ],
        usdAmount: getUsdTotal(token0Info, token1Info, rewardAmount0, rewardAmount1),
      },
      ticks: {
        tickLower,
        tickUpper,
      },
    };
    return positionFullInfo;
  });
  console.log(fPositions);
  return fPositions;
};

import BN, { BigNumber } from 'bignumber.js';

const DEFAULT_DECIMALS = 18;
const BN_STRING_BASE = 10;

export type TPositionData = [
    platform: string,
    tokenId: BN,
    poolId: string,
    token0: string,
    token1: string,
    amount0: BN,
    amount1: BN,
    rewardAmount0: BN,
    rewardAmount1: BN,
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

const getPoolsMap = (poolInfo: TPoolInfo[]) => poolInfo
  .reduce((acc, pool) => ({ ...acc, [pool.address]: pool }), {});
const getTokenNames = (poolName: string) => {
  const tokens = poolName.split('/');
  return {
    token0: tokens[0],
    token1: tokens[1],
  };
};

export const formatPositionData = (posDataArr: TPositionData[], poolInfo: TPoolInfo[]) => {
  const poolMap: {[key: string]: TPoolInfo} = getPoolsMap(poolInfo);
  return posDataArr.flatMap((
    [platform, tokenId, poolId, token0, token1, amount0, amount1, rewardAmount0, rewardAmount1,
      tickLower, tickUpper, apr]: TPositionData,
  ) => {
    if (poolMap[poolId]) {
      const pool = poolMap[poolId];
      const tokenNames = getTokenNames(pool.name);
      return {
        ...poolMap[poolId],
        position: [
          { [tokenNames.token0]: amount0 },
          { [tokenNames.token1]: amount1 },
        ],
        rewards: [
          { [tokenNames.token0]: rewardAmount0 },
          { [tokenNames.token1]: rewardAmount1 },
        ],
        ticks: {
          tickLower,
          tickUpper,
        },
      };
    }
  });
};

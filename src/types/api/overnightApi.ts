import type BigNumber from 'bignumber.js';
// Pool aggregator
export type TPoolTokenData = {
    tokenId: string,
    decimals: string,
    name: string,
    symbol: string,
    amount: string,
    price: string
}
export type TPoolData = {
    chainName: string,
    chainId: number,
    poolVersion: string,
    name: string,
    poolAddress: string,
    platform: string,
    fee: string,
    initPrice: string,
    price: string,
    tickSpacing: string,
    gauge: string,
    tvl: string
    token0: TPoolTokenData,
    token1: TPoolTokenData,
}

export type TTokenData = {
    address: string,
    name: string,
    symbol: string,
    id: string,
    score: number,
    decimals: number,
    price: string,
    image_url: string,
    isPoolToken: boolean
}

export interface IStrategyResponseOld {
    id: string,
    name: string,
    type: string,
    fullName: string,
    weight: number,
    address: string,
    explorerAddress: string,
    netAssetValue: Number,
    liquidationValue: Number,
    riskFactor: Number
}

export interface IStrategyPayoutResponse {
    name: string,
    loss: BigNumber,
    performanceFee: BigNumber,
    profit: BigNumber,
    date: Date,
    liquidityIndex: BigNumber,
    supply: BigNumber,
    nav: BigNumber,
    rewards: BigNumber,
    dailyProfit: BigNumber,
    elapsedTime: BigNumber,
    grossApy: BigNumber,
    deltaNav: BigNumber,
    grossProfit: BigNumber,
    netProfit: BigNumber,
    netApy: BigNumber
}
export interface IStrategyResponse {
    id: string,
    address: string,
    growPnl: BigNumber,
    rewardPnl: BigNumber,
    totalPnl: BigNumber,
    apy: BigNumber,
    growApy: BigNumber,
    rewardApy: BigNumber,
    netAssetValue: BigNumber,
    weight: BigNumber,
    name: string,
    liquidationValue: BigNumber,
}
export interface IInsPayoutResponse {
    profit: BigNumber,
    totalSupply: BigNumber,
    ownerLength: BigNumber,
    timestamp: Date,
    dailyProfit: BigNumber,
    elapsedTime: BigNumber,
    apy: BigNumber,
    deltaUsers: BigNumber,
    deltaSupply: BigNumber,
    hash: string,
    chain: string
}

export interface IInsPayoutResponseOld {
    id: {
        hash: string,
        chain: string,
    },
    token: string,
    supply: Number,
    deltaSupply: Number,
    profit: Number,
    dailyProfit: Number,
    elapsedTime: Number,
    apy: Number,
    liquidityIndex: Number,
    users: Number,
    deltaUsers: Number,
    date: Date,
    hash: string
    timestamp: Date,
}

export interface IInsStatResponse {
    apy: BigNumber,
    apyAll: BigNumber,
    apyMonth: BigNumber,
    supply: BigNumber,
}

export interface IInsStatResponseOld {
    insuredList: string[],
    apy: Number,
    apyAll: Number,
    apyMonth: Number,
    supply: Number,
    supplyUSD: Number,
    coverage: Number
}
export interface IClientBalanceChangeResponse {
   hash: string,
   amount: BigNumber,
   timestamp: Date,
   block: BigNumber,
   type: string,
   balanceBefore: BigNumber,
   balanceAfter: BigNumber
}

export interface IClientBalanceChangeResponseOld {
    address: string,
    transaction_hash: string,
    date: Date,
    type: string,
    opening_balance: Number,
    change_balance: Number,
    closing_balance: Number,
    fee: Number,
    apy: Number,
    elapsed_time: Number
 }

export interface IPayoutResponseOld {
    transactionHash: string;
    payableDate: string;
    dailyProfit: number;
    annualizedYield: number;
    liquidationValue: number;
    totalUsdPlus: number;
    netAssetValue: number;
    totalUsdc: number;
    duration: number;
  }

export interface IPayoutResponse {
    transactionHash: string,
    payableDate: string,
    dailyProfit: BigNumber,
    annualizedYield: BigNumber,
    totalUsdPlus: BigNumber,
    totalUsdc: BigNumber
    duration: BigNumber,
}

export interface IStatTvlResponse {
        chainName: string,
        values: [
            {
                name: string,
                value: number,
            },
        ]
}

// Old API
export type TChainTokenMap = {
    chainTokenMap: {
        [key: string]: {
            tokenMap: {
                [key: string]: TTokenData
            }
        },
    }
}

export interface IWidgetDataResponse {
    tvl: number,
    totalProfit: number,
    'usdPlusProduct': {
        apy: BigNumber,
        chain: string,
        productType: string
    },
    'ethPlusProduct': {
        apy: BigNumber,
        chain: string,
        productType: string
    },
    lastPayoutDate: Date
}

// Odos
export interface IOdosTokenPriceResponse {
    currencyId: string,
    price: BigNumber,
}

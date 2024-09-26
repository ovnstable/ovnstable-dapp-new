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
    weight: Number,
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
    strategy: string,
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

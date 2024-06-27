import type BigNumber from 'bignumber.js';

export type TBalanceInfo = {
    name: string,
    balance: string,
    balanceInUsd: string,
    originalBalance: string,
    decimal: number,
  }

export type TTokenInfo = {
    id: string,
    address: string,
    decimals: number,
    assetType: string,
    name: string,
    symbol: string,
    logoUrl: string,
    selected: false,
    price: string,
    balanceData?: TBalanceInfo,
  }

export type TTokenBalanceMap = {
    [key: string]: TBalanceInfo,
  }

export type TTokenBalanceData = {
    [key: string]: BigNumber,
}

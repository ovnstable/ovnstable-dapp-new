import type BigNumber from 'bignumber.js';

export type TBalanceInfo = {
    name: string,
    balance: string,
    balanceInUsd: string,
    originalBalance: string,
    decimal: number,
  }

  type TApproveData = {
    allowanceValue: number,
    approved: boolean,
  }

export type TTokenInfo = {
    id: string,
    address: string,
    decimals: number,
    assetType: string,
    name: string,
    symbol: string,
    score: number,
    logoUrl: string,
    selected: boolean,
    price: string,
    balanceData?: TBalanceInfo,
    approveData?: TApproveData,
    isPoolToken?: boolean,
  }

export type TTokenBalanceMap = {
    [key: string]: TBalanceInfo,
  }

export type TTokenBalanceData = {
    [key: string]: BigNumber,
}

export type TInputToken = {
    id: string,
    value: string,
    sum: string,
    locked: boolean,
    selectedToken: TTokenInfo,
}

export interface IInputTokenInfo extends TInputToken {
  usdValue: string,
  proportion: string,
  displayedValue: string,
}

export interface ISuccessTokenInfo extends TTokenInfo {
  value: string,
}

export type ISuccessTokenData = {
  [key: string]: any;
} & {
  usdValue: string;
};

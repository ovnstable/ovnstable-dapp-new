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
    approved: false,
  }

export type TTokenInfo = {
    id: string,
    address: string,
    decimals: number,
    assetType: string,
    name: string,
    symbol: string,
    logoUrl: string,
    selected: boolean,
    price: string,
    balanceData?: TBalanceInfo,
    approveData?: TApproveData,
  }

  interface ISuccessTokenInfo extends TTokenInfo {
    value: string,
  }

  type ISuccessTokenData = {
    [key: string]: any;
} & {
    usdValue: string;
};

export type TTokenBalanceMap = {
    [key: string]: TBalanceInfo,
  }

export type TTokenBalanceData = {
    [key: string]: BigNumber,
}

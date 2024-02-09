export type Strategy = {
  address: string;
  explorerAddress: string;
  fullName: string;
  id: string;
  liquidationValue: number;
  name: string;
  netAssetValue: number;
  riskFactor: number;
  type: string;
  weight: number;
}
export type Payout = {
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

export type Collateral = {
  id: {
    strategyName: string;
    tokenName: string;
    chain: string;
    token: string;
  },
  strategyAddress: string;
  tokenAddress: string;
  percentage: number;
  netAssetValue: number;
  updateDate: string;
}

export type Tokens = {
  [key: string]: {
    tokenName: string;
    tokenImageName: string;
    collateralToken: string;
    description: string;
    tokenLink: string;
  };
};

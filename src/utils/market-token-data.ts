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

type Tokens = {
  [key: string]: {
    tokenName: string;
    tokenImageName: string;
    collateralToken: string;
    description: string;
    tokenLink: string;
  };
};

// eslint-disable-next-line import/prefer-default-export
export const TOKENS: Tokens = {
  usd: {
    tokenName: 'USD+',
    tokenImageName: 'USD+_money_markets',
    collateralToken: 'USDC',
    description: 'A risk-minimised USDC-pegged crypto asset backed by an underlying basket of USD stablecoins',
    tokenLink: 'https://arbiscan.io/address/0xD4939D69B31fbE981ed6904A3aF43Ee1dc777Aab',
  },
};

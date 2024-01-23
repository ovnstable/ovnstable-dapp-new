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

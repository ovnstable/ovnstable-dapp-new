/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */

const allChainsTokens = [
  {
    symbol: 'USD+',
    contractName: 'usdPlus',
  },
  {
    symbol: 'DAI+',
    contractName: 'daiPlus',
  },
  {
    symbol: 'DAI',
    contractName: 'dai',
  },
];

const chains_56_59144_42161 = [
  {
    symbol: 'USDT+',
    contractName: 'usdtPlus',
  },
  {
    symbol: 'USDT',
    contractName: 'usdt',
  },
];

const ovnToken = {
  symbol: 'OVN',
  contractName: 'ovn',
};

const wUsdToken = {
  symbol: 'wUSD+',
  contractName: 'wUsdPlus',
};

export const USER_BALANCES_SCHEME = {
  42161: [
    ...allChainsTokens,
    ...chains_56_59144_42161,
    ovnToken,
    wUsdToken,
    {
      symbol: 'USDC.e',
      contractName: 'usdcBridged',
    },
    {
      symbol: 'ETH+',
      contractName: 'ethPlus',
    },
    {
      symbol: 'wETH+',
      contractName: 'wEthPlus',
    },
    {
      symbol: 'WETH',
      contractName: 'weth',
    },
  ],
  8453: [
    ...allChainsTokens,
    ovnToken,
    wUsdToken,
    // bridged usdc.e
    {
      symbol: 'USDC.e',
      contractName: 'usdcNative',
    },
    // native usdc
    {
      symbol: 'USDC',
      contractName: 'usdc',
    },
  ],
  56: [
    ...chains_56_59144_42161,
  ],
  137: [
    wUsdToken,
  ],
  10: [
    ovnToken,
    wUsdToken,
  ],
  59144: [],
};

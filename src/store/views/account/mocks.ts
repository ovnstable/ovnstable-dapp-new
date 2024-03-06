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

const chains_56_324_137 = [
  {
    symbol: 'USD+',
    contractName: 'usdPlus',
  },
  {
    symbol: 'USDC',
    contractName: 'usdcBridged',
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
    {
      symbol: 'OVNINS',
      contractName: '',
    },
  ],
  8453: [
    ...allChainsTokens,
    ovnToken,
    wUsdToken,
    {
      symbol: 'USDC+',
      contractName: 'usdcPlus',
    },
    // bridged usdc.e
    {
      symbol: 'USDbC',
      contractName: 'usdcBridged',
    },
    // native usdc
    {
      symbol: 'USDC',
      contractName: 'usdcNative',
    },
  ],
  56: [
    ...chains_56_59144_42161,
    ...chains_56_324_137,
  ],
  137: [
    wUsdToken,
    ...chains_56_324_137,
  ],
  10: [
    ...allChainsTokens,
    ovnToken,
    wUsdToken,
    {
      symbol: 'USDC.e',
      contractName: 'usdcBridged',
    },
    {
      symbol: 'OVNINS',
      contractName: '',
    },
  ],
  324: [
    ...chains_56_324_137,
  ],
  59144: [
    ...chains_56_59144_42161,
    {
      symbol: 'USDT+',
      contractName: 'usdtPlus',
    },
    {
      symbol: 'USDC',
      contractName: 'asset',
    },
  ],
  81457: [
    {
      symbol: 'USD+',
      contractName: 'usdPlus',
    },
    {
      symbol: 'USDC+',
      contractName: 'usdcPlus',
    },
  ],
};

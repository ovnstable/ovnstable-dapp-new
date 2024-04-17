/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */

const allChainsTokens = [
  {
    symbol: 'USD+',
    contractName: 'usdPlus',
    isOvnToken: true,
  },
  {
    symbol: 'DAI+',
    contractName: 'daiPlus',
    isOvnToken: true,
  },
  {
    symbol: 'DAI',
    contractName: 'dai',
    isOvnToken: true,
  },
];

const chains_56_59144_42161 = [
  {
    symbol: 'USDT+',
    contractName: 'usdtPlus',
    isOvnToken: true,
  },
  {
    symbol: 'USDT',
    contractName: 'usdt',
    isOvnToken: false,
  },
];

const chains_56_324_137 = [
  {
    symbol: 'USD+',
    contractName: 'usdPlus',
    isOvnToken: true,
  },
  {
    symbol: 'USDC',
    contractName: 'usdcBridged',
  },
];

const ovnToken = {
  symbol: 'OVN',
  contractName: 'ovn',
  isOvnToken: true,
};

const wUsdToken = {
  symbol: 'wUSD+',
  contractName: 'wUsdPlus',
  isOvnToken: true,
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
      isOvnToken: false,
    },
    {
      symbol: 'USDC.e',
      contractName: 'usdcBridged',
      isOvnToken: false,
    },
    {
      symbol: 'ETH+',
      contractName: 'ethPlus',
      isOvnToken: false,
    },
    {
      symbol: 'wETH+',
      contractName: 'wEthPlus',
      isOvnToken: false,
    },
    {
      symbol: 'WETH',
      contractName: 'weth',
      isOvnToken: false,
    },
    {
      symbol: 'OVNINS',
      contractName: '',
      isOvnToken: false,
    },
  ],
  8453: [
    ...allChainsTokens,
    ovnToken,
    wUsdToken,
    {
      symbol: 'USDC+',
      contractName: 'usdcPlus',
      isOvnToken: true,
    },
    // bridged usdc.e
    {
      symbol: 'USDbC',
      contractName: 'usdcBridged',
      isOvnToken: false,
    },
    // native usdc
    {
      symbol: 'USDC',
      contractName: 'usdcNative',
      isOvnToken: true,
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
      isOvnToken: false,
    },
    {
      symbol: 'OVNINS',
      contractName: '',
      isOvnToken: false,
    },
  ],
  324: [
    ...chains_56_324_137,
  ],
  59144: [
    ...chains_56_59144_42161,
    wUsdToken,
    {
      symbol: 'USD+',
      contractName: 'usdPlus',
      isOvnToken: true,
    },
    {
      symbol: 'USDT+',
      contractName: 'usdtPlus',
      isOvnToken: true,
    },
    {
      symbol: 'USDC.e',
      contractName: 'usdcBridged',
    },
    {
      symbol: 'USDC',
      contractName: 'asset',
      isOvnToken: false,
    },
  ],
  81457: [
    {
      symbol: 'USDB',
      contractName: 'usdb',
      isOvnToken: false,
    },
    {
      symbol: 'USD+',
      contractName: 'usdPlus',
      isOvnToken: true,
    },
    {
      symbol: 'USDC+',
      contractName: 'usdcPlus',
      isOvnToken: true,
    },
  ],
};

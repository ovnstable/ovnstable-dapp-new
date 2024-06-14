import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

// eslint-disable-next-line vue/max-len
const binaryString = '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000025000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000020000000000000000000000004200000000000000000000000000000000000006000000000000000000000000b79dd08ea68a908a97220c76d19a6aa9cbde4376';

const abiCoder = new ethers.AbiCoder();
const returnedToUserData = abiCoder.decode(['uint256[]', 'address[]'], binaryString);
const returnedToUser = {
  amounts: returnedToUserData[0].map((amount: any) => BigNumber(amount)),
  addresses: returnedToUserData[1],
};

export const succesDataMock = {
  inputTokens: [
    {
      id: '08hz9rspvs',
      value: '15.00',
      usdValue: '0.050107',
      contractValue: '50000',
      selectedToken: {
        id: 'usd-plus0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
        address: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
        decimals: 6,
        assetType: 'usd',
        name: 'USD+',
        symbol: 'USD+',
        logoUrl: 'http://localhost:5173/src/assets/icons/currencies/stablecoins/USD+.png',
        selected: true,
        balanceData: {
          name: 'USD+',
          balance: '0.1037',
          balanceInUsd: '0.103962528366562600492',
          originalBalance: '103739',
          decimal: 6,
        },
        approveData: {
          allowanceValue: '999999999999999999100000',
          approved: true,
        },
        price: '1.00215471873222800000',
      },
    },
  ],
  outputTokens: [{
    id: '5gw83sdm6k',
    value: 49.76294165478816,
    sum: '0.000087',
    locked: true,
    selectedToken: {
      id: 'weth0x4200000000000000000000000000000000000006',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      assetType: 'eth',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      logoUrl: 'http://localhost:5173/src/assets/icons/currencies/select/WETH.webp',
      selected: true,
      balanceData: {
        name: 'WETH',
        balance: '0.00000011',
        balanceInUsd: '0.00037499023906226446724508493',
        originalBalance: '106078831450',
        decimal: 6,
      },
      approveData: {
        allowanceValue: 0,
        approved: false,
      },
      price: '3535.01479924404340000000',
    },
  }, {
    id: '5gw83sdm6k',
    value: 49.76294165478816,
    sum: '10.0500',
    locked: true,
    selectedToken: {
      id: 'weth0x4200000000000000000000000000000000000006',
      address: '0x4200000000000000000000000000000000000006',
      decimals: 6,
      assetType: 'eth',
      name: 'Wrapped Ether',
      symbol: 'USD+',
      logoUrl: 'http://localhost:5173/src/assets/icons/currencies/select/WETH.webp',
      selected: true,
      balanceData: {
        name: 'WETH',
        balance: '0.00000011',
        balanceInUsd: '0.00037499023906226446724508493',
        originalBalance: '106078831450',
        decimal: 18,
      },
      approveData: {
        allowanceValue: 0,
        approved: false,
      },
      price: '3535.01479924404340000000',
    },
  }],
  pool: {
    id: 'WETH/USD+2704581.39Aerodrome',
    name: 'WETH/USD+',
    token0Icon: 'http://localhost:5173/src/assets/icons/currencies/select/WETH.webp',
    token1Icon: 'http://localhost:5173/src/assets/icons/currencies/select/USD+.webp',
    token2Icon: null,
    token3Icon: null,
    poolVersion: 'v3',
    chain: 8453,
    chainName: 'base',
    address: '0x4D69971CCd4A636c403a3C1B00c85e99bB9B5606',
    platform: [
      'Aerodrome',
    ],
    tvl: 2704581.39,
    apr: 646.52,
    poolTag: '2',
    skimEnabled: false,
    explorerUrl: 'https://basescan.org/',
    zappable: true,
    cardOpened: false,
    data: {
      id: {
        name: 'WETH/USD+',
        address: '0x4D69971CCd4A636c403a3C1B00c85e99bB9B5606',
        chain: 'BASE',
      },
      platform: 'Aerodrome',
      tvl: 2704581.39,
      apr: 646.52,
      pool_version: 'v3',
      updateDate: '2024-06-10T21:00:28.34',
      addToSync: true,
      skimEnabled: false,
      promoted: false,
      transfersSyncEnabled: false,
      skimUpdateDate: null,
      zappable: true,
      aggregators: [],
    },
    aggregators: [],
    promoted: false,
    isOpened: false,
    stableFishUrl: null,
  },
};

export const returnedDataMock = {
  // amounts: [
  //   new BigNumber(0),
  //   new BigNumber(1836050042n.toString()),
  // ],
  amounts: returnedToUser,
  addresses: [
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
  ],
};

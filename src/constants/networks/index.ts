/* eslint-disable import/prefer-default-export */
const POLYGON_PARAMS = {
  appApiUrl: 'https://api.overnight.fi/root',
  networkName: 'polygon',
  networkId: 137,
  rpcUrl: 'https://polygon-rpc.com/',
  explorerUrl: 'https://polygonscan.com/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'MATIC',
  bridgeLink: 'https://router.via.exchange/polygon/USD+/bsc/USD+',
  networkColor: '#7B3FE4',
  isDeprecated: true,
};

const BSC_PARAMS = {
  appApiUrl: 'https://bsc.overnight.fi/api',
  networkName: 'bsc',
  networkId: 56,
  rpcUrl: 'https://bsc-dataseed.binance.org',
  explorerUrl: 'https://bscscan.com/',
  assetName: 'USDC',
  assetDecimals: 18,
  nativeAssetName: 'BNB',
  bridgeLink: 'https://router.via.exchange/bsc/USD+/optimism/USD+',
  networkColor: '#F3BA2F',
  isDeprecated: false,
};

const OPTIMISM_PARAMS = {
  appApiUrl: 'https://op.overnight.fi/api',
  networkName: 'optimism',
  networkId: 10,
  rpcUrl: 'https://optimism.llamarpc.com',
  explorerUrl: 'https://optimistic.etherscan.io/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://router.via.exchange/optimism/USD+/bsc/USD+',
  networkColor: '#FF0420',
  isDeprecated: false,
};

const ARBITRUM_PARAMS = {
  appApiUrl: 'https://arbitrum.overnight.fi/api',
  networkName: 'arbitrum',
  networkId: 42161,
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  explorerUrl: 'https://arbiscan.io/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://router.via.exchange/arbitrum/USD+/bsc/USD+',
  networkColor: '#29A0F0',
  isDeprecated: false,
};

const ZKSYNC_PARAMS = {
  appApiUrl: 'https://zksync.overnight.fi/api',
  networkName: 'zksync',
  networkId: 324,
  rpcUrl: 'https://mainnet.era.zksync.io', // 'https://zksync2-testnet.zksync.dev', //https://mainnet.era.zksync.io',
  explorerUrl: 'https://explorer.zksync.io/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://router.via.exchange/zksync/USD+/bsc/USD+',
  networkColor: '#8B8DFC',
  isDeprecated: false,
};

const BASE_PARAMS = {
  appApiUrl: 'https://base.overnight.fi/api',
  networkName: 'base',
  networkId: 8453,
  rpcUrl: 'https://base.drpc.org',
  explorerUrl: 'https://basescan.org/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://bridge.base.org/',
  networkColor: '#0052ff',
  isDeprecated: false,
};

const LINEA_PARAMS = {
  appApiUrl: 'https://linea.overnight.fi/api',
  networkName: 'linea',
  networkId: 59144,
  rpcUrl: 'https://linea.drpc.org',
  explorerUrl: 'https://lineascan.build/',
  assetName: 'USDC',
  assetDecimals: 6,
  nativeAssetName: 'ETH',
  bridgeLink: 'https://bridge.linea.build/',
  networkColor: '#5fdfff',
  isDeprecated: false,
};

const BLAST_PARAMS = {
  appApiUrl: 'https://blast.overnight.fi/api',
  networkName: 'blast',
  networkId: 81457,
  rpcUrl: 'https://blast.gasswap.org',
  explorerUrl: 'https://blastscan.io/',
  assetName: 'USDB',
  assetDecimals: 18,
  nativeAssetName: 'ETH',
  bridgeLink: '',
  networkColor: '#fff561',
  isDeprecated: false,
};

export const allNetworkConfigs = [
  OPTIMISM_PARAMS,
  ARBITRUM_PARAMS,
  ZKSYNC_PARAMS,
  BASE_PARAMS,
  LINEA_PARAMS,
  BSC_PARAMS,
  POLYGON_PARAMS,
  BLAST_PARAMS,
];

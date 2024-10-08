/* eslint-disable import/prefer-default-export */
import { chainContractsMap } from '@/utils/contractsMap.ts';

export const BLAST_TOKENS = {
  81457: {
    tokenMap: {
      [chainContractsMap.blast.usdb]: {
        assetId: 'usdb',
        assetType: 'usdb',
        decimals: 18,
        isRebasing: false,
        name: 'USDB',
        symbol: 'USDB',
      },
      [chainContractsMap.blast.usdPlus.tokenPlus]: {
        assetId: 'usdPlus',
        assetType: 'usdPlus',
        decimals: 18,
        isRebasing: false,
        name: 'USD+',
        symbol: 'USD+',
      },
      [chainContractsMap.blast.usdcPlus.tokenPlus]: {
        assetId: 'usdcPlus',
        assetType: 'usdcPlus',
        decimals: 18,
        isRebasing: false,
        name: 'USDC+',
        symbol: 'USDC+',
      },
    },
  },
};

export const LINEA_TOKENS = {
  59144: {
    tokenMap: {
      [chainContractsMap.linea.usdPlus.wUsdPlus]: {
        assetId: 'wUSD',
        assetType: 'wUSD',
        decimals: 6,
        isRebasing: false,
        name: 'wUSD+',
        symbol: 'wUSD+',
      },
      [chainContractsMap.linea.usdPlus.tokenPlus]: {
        assetId: 'usdPlus',
        assetType: 'usdPlus',
        decimals: 6,
        isRebasing: false,
        name: 'USD+',
        symbol: 'USD+',
      },
      [chainContractsMap.linea.usdtPlus.tokenPlus]: {
        assetId: 'usdtPlus',
        assetType: 'usdtPlus',
        decimals: 6,
        isRebasing: true,
        name: 'USDT+',
        symbol: 'USDT+',
      },
    },
  },
};

export const ZKSYNC_TOKENS = {
  324: {
    tokenMap: {
      [chainContractsMap.zksync.usdPlus.tokenPlus]: {
        assetId: 'usdPlus',
        assetType: 'usdPlus',
        decimals: 6,
        isRebasing: false,
        name: 'USD+',
        symbol: 'USD+',
      },
      [chainContractsMap.zksync.usdtPlus.tokenPlus]: {
        assetId: 'usdtPlus',
        assetType: 'usdtPlus',
        decimals: 6,
        isRebasing: true,
        name: 'USDT+',
        symbol: 'USDT+',
      },
    },
  },
};

export const OP_TOKENS = {
  10: {
    tokenMap: {
      [chainContractsMap.optimism.usdPlus.tokenPlus]: {
        assetId: 'usdPlus',
        assetType: 'usdPlus',
        decimals: 6,
        isRebasing: false,
        name: 'USD+',
        symbol: 'USD+',
      },
    },
  },
};

export const SFRAX_TOKEN = {
  8453: {
    tokenMap: {
      '0xe4796cCB6bB5DE2290C417Ac337F2b66CA2E770E': {
        assetId: 'sfrax',
        assetType: 'sfrax',
        decimals: 18,
        isRebasing: false,
        name: 'Staked FRAX',
        protocolId: 'frax',
        symbol: 'sFRAX',
      },
    },
  },
};

export const BLAST_TOKENS_PRICES = {
  81457: {
    [chainContractsMap.blast.usdb]: 1,
    [chainContractsMap.blast.usdPlus.tokenPlus]: 1,
    [chainContractsMap.blast.usdcPlus.tokenPlus]: 1,
  },
};

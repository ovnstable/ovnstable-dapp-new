/* eslint-disable import/prefer-default-export */
import { chainContractsMap } from '@/utils/contractsMap.ts';

export const BLAST_TOKENS = {
};

export const LINEA_TOKENS = {
  59144: {
    tokenMap: {
      [chainContractsMap.linea.usdc]: {
        assetId: 'USDC',
        assetType: 'USDC',
        decimals: 6,
        isRebasing: false,
        name: 'USDC',
        symbol: 'USDC',
      },
      [chainContractsMap.linea.usdPlus.tokenPlus]: {
        assetId: 'usdPlus',
        assetType: 'usdPlus',
        decimals: 6,
        isRebasing: false,
        name: 'USD+',
        symbol: 'USD+',
      },
      [chainContractsMap.linea.usdt]: {
        assetId: 'USDT',
        assetType: 'USDT',
        decimals: 6,
        isRebasing: false,
        name: 'USDT',
        symbol: 'USDT',
      },
      [chainContractsMap.linea.usdtPlus.tokenPlus]: {
        assetId: 'usdtPlus',
        assetType: 'usdtPlus',
        decimals: 6,
        isRebasing: false,
        name: 'USDT+',
        symbol: 'USDT+',
      },
    },
  },
};

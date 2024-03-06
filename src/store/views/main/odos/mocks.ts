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

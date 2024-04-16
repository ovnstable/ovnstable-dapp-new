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
    },
  },
};

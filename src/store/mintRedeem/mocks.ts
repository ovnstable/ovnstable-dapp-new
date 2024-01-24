/* eslint-disable import/prefer-default-export */
import { chainContractsMap } from '@/utils/contractsMap.ts';

// configs for all CHAINS where ---> FROM[0] - TO[1]
export const MINTREDEEM_42161 = [
  [
    chainContractsMap.arbitrum.usdc,
    chainContractsMap.arbitrum.usdPlus.tokenPlus,
  ],
  [
    chainContractsMap.arbitrum.usdPlus.tokenPlus,
    chainContractsMap.arbitrum.usdPlus.wUsdPlus,
  ],
  [
    chainContractsMap.arbitrum.dai,
    chainContractsMap.arbitrum.daiPlus.tokenPlus,
  ],
  [
    chainContractsMap.arbitrum.usdt,
    chainContractsMap.arbitrum.usdtPlus.tokenPlus,
  ],
  [
    chainContractsMap.arbitrum.wETH,
    chainContractsMap.arbitrum.ethPlus.tokenPlus,

  ],
  [
    chainContractsMap.arbitrum.ethPlus.tokenPlus,
    chainContractsMap.arbitrum.wEthPlus.tokenPlus,
  ],
];

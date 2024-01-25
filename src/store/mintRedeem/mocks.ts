/* eslint-disable import/prefer-default-export */
import { chainContractsMap } from '@/utils/contractsMap.ts';

// configs for all CHAINS where ---> FROM[0] - TO[1]
export const MINTREDEEM_SCHEME = {
  // arbitrum
  42161: [
    {
      token0: chainContractsMap.arbitrum.usdc,
      token1: chainContractsMap.arbitrum.usdPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.usdPlus.exchange,
    },
    {
      token0: chainContractsMap.arbitrum.usdPlus.tokenPlus,
      token1: chainContractsMap.arbitrum.usdPlus.wUsdPlus,
      exchange: chainContractsMap.arbitrum.market,
    },
    {
      token0: chainContractsMap.arbitrum.dai,
      token1: chainContractsMap.arbitrum.daiPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.daiPlus.exchange,
    },
    {
      token0: chainContractsMap.arbitrum.usdt,
      token1: chainContractsMap.arbitrum.usdtPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.usdPlus.exchange,
    },
    {
      token0: chainContractsMap.arbitrum.wETH,
      token1: chainContractsMap.arbitrum.ethPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.ethPlus.exchange,
    },
    {
      token0: chainContractsMap.arbitrum.ethPlus.tokenPlus,
      token1: chainContractsMap.arbitrum.wEthPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.marketWeth,
    },
  ],
  // base
  8453: [
    {
      token0: chainContractsMap.base.usdc,
      token1: chainContractsMap.base.usdPlus.tokenPlus,
      exchange: chainContractsMap.base.usdPlus.exchange,
    },
    {
      token0: chainContractsMap.base.usdcNative,
      token1: chainContractsMap.base.usdcPlus.tokenPlus,
      exchange: chainContractsMap.base.usdcPlus.exchange,
    },
    {
      token0: chainContractsMap.base.usdPlus.tokenPlus,
      token1: chainContractsMap.base.usdPlus.wUsdPlus,
      exchange: chainContractsMap.base.market,
    },
    {
      token0: chainContractsMap.base.dai,
      token1: chainContractsMap.base.daiPlus.tokenPlus,
      exchange: chainContractsMap.base.daiPlus.exchange,
    },
  ],
};

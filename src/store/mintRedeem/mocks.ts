/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { chainContractsMap } from '@/utils/contractsMap.ts';
import { mintRedeemTypes } from '@/modules/Main/components/MintRedeem/types/index.ts';

// configs for all CHAINS where ---> FROM[0] - TO[1]
export const MINTREDEEM_SCHEME = {
  // arbitrum
  42161: [
    {
      token0: chainContractsMap.arbitrum.usdc,
      token1: chainContractsMap.arbitrum.usdPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.usdPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.arbitrum.usdPlus.tokenPlus,
      token1: chainContractsMap.arbitrum.usdPlus.wUsdPlus,
      exchange: chainContractsMap.arbitrum.market,
      methodName: [mintRedeemTypes.WRAP, mintRedeemTypes.UNWRAP],
    },
    {
      token0: chainContractsMap.arbitrum.dai,
      token1: chainContractsMap.arbitrum.daiPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.daiPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.arbitrum.usdt,
      token1: chainContractsMap.arbitrum.usdtPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.usdPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.arbitrum.wETH,
      token1: chainContractsMap.arbitrum.ethPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.ethPlus.exchange,
      methodName: [mintRedeemTypes.WRAP, mintRedeemTypes.UNWRAP],
    },
    {
      token0: chainContractsMap.arbitrum.ethPlus.tokenPlus,
      token1: chainContractsMap.arbitrum.wEthPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.ethPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
  ],
  // base
  8453: [
    {
      token0: chainContractsMap.base.usdc,
      token1: chainContractsMap.base.usdPlus.tokenPlus,
      exchange: chainContractsMap.base.usdPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.base.usdcNative,
      token1: chainContractsMap.base.usdcPlus.tokenPlus,
      exchange: chainContractsMap.base.usdcPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.base.usdPlus.tokenPlus,
      token1: chainContractsMap.base.usdPlus.wUsdPlus,
      exchange: chainContractsMap.base.market,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.base.dai,
      token1: chainContractsMap.base.daiPlus.tokenPlus,
      exchange: chainContractsMap.base.daiPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
  ],
};

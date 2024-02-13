/* eslint-disable import/prefer-default-export */
import { chainContractsMap } from '@/utils/contractsMap.ts';
import { mintRedeemTypes } from '@/modules/Main/components/MintRedeem/types/index.ts';

// configs for all CHAINS
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
      exchange: chainContractsMap.arbitrum.usdtPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.arbitrum.wETH,
      token1: chainContractsMap.arbitrum.ethPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.ethPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.arbitrum.ethPlus.tokenPlus,
      token1: chainContractsMap.arbitrum.wEthPlus.tokenPlus,
      exchange: chainContractsMap.arbitrum.marketWeth,
      methodName: [mintRedeemTypes.WRAP, mintRedeemTypes.UNWRAP],
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
  // optimism
  10: [
    {
      token0: chainContractsMap.optimism.usdc,
      token1: chainContractsMap.optimism.usdPlus.tokenPlus,
      exchange: chainContractsMap.optimism.usdPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.optimism.usdPlus.tokenPlus,
      token1: chainContractsMap.optimism.usdPlus.wUsdPlus,
      exchange: chainContractsMap.optimism.market,
      methodName: [mintRedeemTypes.WRAP, mintRedeemTypes.UNWRAP],
    },
    {
      token0: chainContractsMap.optimism.dai,
      token1: chainContractsMap.optimism.daiPlus.tokenPlus,
      exchange: chainContractsMap.optimism.daiPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
  ],
  // linea
  59144: [
    {
      token0: chainContractsMap.linea.usdc,
      token1: chainContractsMap.linea.usdPlus.tokenPlus,
      exchange: chainContractsMap.linea.usdPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.linea.usdt,
      token1: chainContractsMap.linea.usdtPlus.tokenPlus,
      exchange: chainContractsMap.linea.usdtPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
  ],
  // bsc
  56: [
    {
      token0: chainContractsMap.bsc.usdc,
      token1: chainContractsMap.bsc.usdPlus.tokenPlus,
      exchange: chainContractsMap.bsc.usdPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.bsc.usdt,
      token1: chainContractsMap.bsc.usdtPlus.tokenPlus,
      exchange: chainContractsMap.bsc.usdtPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
  ],
  // zk
  324: [
    {
      token0: chainContractsMap.zksync.usdc,
      token1: chainContractsMap.zksync.usdPlus.tokenPlus,
      exchange: chainContractsMap.zksync.usdPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
  ],
  // polygon
  137: [
    {
      token0: chainContractsMap.polygon.usdc,
      token1: chainContractsMap.polygon.usdPlus.tokenPlus,
      exchange: chainContractsMap.polygon.usdPlus.exchange,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
    {
      token0: chainContractsMap.polygon.usdPlus.tokenPlus,
      token1: chainContractsMap.polygon.usdPlus.wUsdPlus,
      exchange: chainContractsMap.polygon.market,
      methodName: [mintRedeemTypes.MINT, mintRedeemTypes.REDEEM],
    },
  ],
};

export const sliderDescriptionForWrapped = (tokenName: string) => `An index-adjusted wrapper for ${tokenName}. Your w${tokenName} balance won't increase over time. When w${tokenName} will unwrap, you receive ${tokenName} based on the latest index.`;

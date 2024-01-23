<template>
  <div class="performance__portfolio">
    <div class="performance__portfolio-tab-content">
      <PortfolioStrategies
        :tokenName="dataStrategies.tokenName"
        :assets="dataStrategies.assets"
        :type="dataStrategies.type"
        :tokenAmountInCirculation="dataStrategies.tokenAmountInCirculation"
        :collateralToken="dataStrategies.collateralToken"
      />
      <PortfolioStrategies
        :tokenName="dataPortfolio.tokenName"
        :assets="dataPortfolio.assets"
        :type="dataPortfolio.type"
        :collateralToken="dataPortfolio.collateralToken"
      />
      <p class="performance__portfolio-token-payout">{{ dataPortfolio.tokenName }} Payouts</p>
    </div>
  </div>
</template>

<script lang="ts">
import PortfolioStrategies from '@/modules/Market/PortfolioStrategies.vue';

export default {
  name: 'PortfolioPerformance',
  components: {
    PortfolioStrategies,
  },
  data() {
    return {
      dataPortfolio: {
        tokenName: 'ETH+',
        type: 'portfolio',
        assets: [
          {
            tokenNameAsset: 'WETH (delta-neutral)',
            tokenImagePath: 'assets/icons/currencies/WSTEth.vue',
            safetyScore: 'VERY HIGH',
            netAssetValue: 80,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          },
          {
            tokenNameAsset: 'WETH',
            tokenImagePath: 'assets/icons/currencies/WSTEth.vue',
            safetyScore: 'VERY HIGH',
            netAssetValue: 50,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
          },
          {
            tokenNameAsset: 'wstETH',
            tokenImagePath: 'assets/icons/currencies/WSTEth.vue',
            safetyScore: 'VERY HIGH',
            netAssetValue: 30,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
          },
        ],
        collateralToken: 'WETH',
      },
      dataStrategies: {
        tokenName: 'ETH+',
        type: 'strategies',
        assets: [
          {
            strategyNameAsset: 'AAVE',
            netAssetValue: 80,
            liquidationValue: 179.9790,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            lendingProtocolDepositedTo: 'Sonne Finance',
            linkDepositedProtocol: '0x454e6869a34dac7ef3f8ec6c1383fea795fdb713',
            depositedAsset: 'USDBC',
            borrowedAsset: 'WETH',
            lpFarmingPlatform: 'Aerodrome',
            lpPair: 'WETH/USDBC',
          },
          {
            strategyNameAsset: 'ETS',
            netAssetValue: 50,
            liquidationValue: 0.0360,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            lendingProtocolDepositedTo: 'Sonne Finance',
            depositedAsset: 'USDBC',
            borrowedAsset: 'WETH',
            lpFarmingPlatform: 'Aerodrome',
            lpPair: 'WETH/USDBC',
          },
          {
            strategyNameAsset: 'Pendle wstETH',
            netAssetValue: 30,
            liquidationValue: 0.0279,
            lendingProtocolDepositedTo: 'Sonne Finance',
            linkDepositedProtocol: '0x454e6869a34dac7ef3f8ec6c1383fea795fdb713',
            depositedAsset: 'USDBC',
            borrowedAsset: 'WETH',
            lpFarmingPlatform: 'Aerodrome',
            lpPair: 'WETH/USDBC',
          },
        ],
        tokenAmountInCirculation: 180.0429,
        collateralToken: 'WETH',
      },
    };
  },
};
</script>

<style scoped>
.performance__portfolio {
    display: flex;
    flex-direction: column;
    background: var(--color-4);
}

.performance__portfolio-tab-content {
    background: var(--color-4);
    transition: opacity 0.3s ease-in-out;
}

.performance__portfolio-token-payout {
  color: var(--color-1);
  font-size: 17px;
  font-weight: 600;
  margin-top: 24px;
}

@media (max-width: 1024px) {
  .performance__portfolio-tab {
    padding-top: 10px;
    padding-bottom: 14px;
  }
}

@media (max-width: 768px) {
  .performance__portfolio-tab {
    padding-top: 5px;
    padding-bottom: 7px;
  }
}

</style>

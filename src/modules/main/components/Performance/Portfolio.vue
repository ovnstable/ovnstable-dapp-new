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
      />

    </div>
  </div>
</template>

<script lang="ts">
import PortfolioStrategies from '@/modules/main/components/Performance/PortfolioStrategies.vue';

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
            tokenImagePath: 'assets/icons/currencies/UsdPlus.vue',
            safetyScore: 'VERY HIGH',
            NAV: 1685335.39,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            percentPortfolio: ' 81.5%',
          },
          {
            tokenNameAsset: 'WETH',
            tokenImagePath: 'assets/icons/currencies/WusdPlus.vue',
            safetyScore: 'VERY HIGH',
            NAV: 192378.56,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
            percentPortfolio: '9.3%',
          },
        ],
      },
      dataStrategies: {
        tokenName: 'ETH+',
        type: 'strategies',
        assets: [
          {
            strategyNameAsset: 'AAVE',
            strategyImagePath: 'assets/icons/strategies/SynapseStrategy.vue',
            netAssetValue: 179.9790,
            liquidationValue: 179.9790,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            percentPortfolio: '95.9%',
          },
          {
            strategyNameAsset: 'ETS',
            strategyImagePath: 'assets/icons/strategies/SynapseStrategy.vue',
            netAssetValue: 0.0360,
            liquidationValue: 0.0360,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            percentPortfolio: '5.3%',
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
    background: var(--color-5);
    width: calc(100% - 40px);
}

.performance__portfolio-tab-content {
    background: var(--color-5);
    transition: opacity 0.3s ease-in-out;
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

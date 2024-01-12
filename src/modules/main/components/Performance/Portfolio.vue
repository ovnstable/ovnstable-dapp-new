<template>
  <div class="performance__portfolio">
    <div class="performance__portfolio-tab-content">
      <PortfolioStrategies
        :tokenName="dataStrategies.tokenName"
        :assets="dataStrategies.assets"
        :type="dataStrategies.type"
        :tokenAmountInCirculation="dataStrategies.tokenAmountInCirculation"
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
        tokenName: 'USD+',
        type: 'portfolio',
        assets: [
          {
            tokenNameAsset: 'USDC',
            tokenImagePath: 'assets/icons/currencies/UsdPlus.vue',
            safetyScore: 'VERY HIGH',
            NAV: 1685335.39,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            percentPortfolio: ' 81.5%',
          },
          {
            tokenNameAsset: 'DAI',
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
        tokenName: 'USD+',
        type: 'strategies',
        assets: [
          {
            strategyNameAsset: 'Synapse USDC',
            strategyImagePath: 'assets/icons/strategies/SynapseStrategy.vue',
            netAssetValue: 826931.41,
            liquidationValue: 826665.69,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            percentPortfolio: '40%',
          },
          {
            strategyNameAsset: 'Dodo USDC v2',
            strategyImagePath: 'assets/icons/strategies/SynapseStrategy.vue',
            netAssetValue: 413481.02,
            liquidationValue: 413232.93,
            percentPortfolioPath: 'assets/icons/common/PercentPortfolio.vue',
            tokenLink: 'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            percentPortfolio: '20%',
          },
        ],
        tokenAmountInCirculation: 65000,
      },
    };
  },
};
</script>

<style scoped>
.performance__portfolio {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    width: calc(100% - 40px);
}

.performance__portfolio-tab-content {
    background: var(--color-white);
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

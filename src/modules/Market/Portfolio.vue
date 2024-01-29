<template>
  <div class="performance__portfolio">
    <div class="performance__portfolio-tab-content">
      <!-- <p>{{ collateralData }}</p> -->
      <PortfolioStrategies
        :tokenName="portfolioData.tokenName"
        :assets="portfolioData.strategies"
        type='strategies'
        :tokenAmountInCirculation="portfolioData.totalPlusToken"
        :collateralToken="portfolioData.collateralToken"
      />
      <PortfolioStrategies
        :tokenName="collateralData.tokenName"
        :assets="collateralData.colleterals"
        type='portfolio'
        :collateralToken="collateralData.collateralToken"
      />
      <p class="performance__portfolio-token-payout">{{ portfolioData.tokenName }} Payouts</p>
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
  props: {
    portfolioData: {
      type: Object,
      default: () => ({}),
    },
    collateralData: {
      type: Object,
      default: () => ({}),
    },
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

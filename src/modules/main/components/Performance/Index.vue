<template>
  <div class="performance">
    <TokenDataPerformance class="performance__token-data" />
    <GraphicsPerformance class="performance__graphics" />
    <PortfolioPerformance class="performance__portfolio" />
    <PortfolioPayouts class="performance__payouts" />
  </div>
</template>

<script lang="ts">
import TokenDataPerformance from '@/modules/main/components/Performance/TokenData.vue';
import GraphicsPerformance from '@/modules/main/components/Performance/Graphics.vue';
import PortfolioPerformance from '@/modules/main/components/Performance/Portfolio.vue';
import PortfolioPayouts from '@/modules/main/components/Performance/Payouts.vue';

export default {
  name: 'PerformancePage',
  components: {
    TokenDataPerformance,
    GraphicsPerformance,
    PortfolioPerformance,
    PortfolioPayouts,
  },
};
</script>

<style>
.performance {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.performance__token-data,
.performance__graphics,
.performance__portfolio,
.performance__payouts {
    width: 100%;
}
.performance__graphics,
.performance__portfolio,
.performance__payouts {
    margin-top: 20px;
}
</style>

<template>
  <div class="performance-wrapper">
    <div class="performance">
      <TokenDataPerformance class="performance__token-data" />
      <GraphicsPerformance class="performance__graphics" />
      <PortfolioPerformance class="performance__portfolio" />
    </div>
    <div class="performance__payouts-wrapper">
      <PortfolioPayouts class="performance__payouts" />
    </div>
  </div>

</template>

<script lang="ts">
import TokenDataPerformance from '@/modules/Main/components/Performance/TokenData.vue';
import GraphicsPerformance from '@/modules/Main/components/Performance/Graphics.vue';
import PortfolioPerformance from '@/modules/Main/components/Performance/Portfolio.vue';
import PortfolioPayouts from '@/modules/Main/components/Performance/Payouts.vue';

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
  border-radius: 20px;
  border: 1px solid var(--color-1);
  background: var(--color-4);
  box-shadow: 0px 1px 0px 0px var(--color-1);
  padding-top: 40px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 20px;
  width: calc(100% - 40px);
}
.performance__token-data,
.performance__graphics,
.performance__portfolio,
.performance__payouts {
    width: 100%;
}
.performance__graphics{
    margin-top: 20px;
}

.performance-wrapper {
  display: flex;
  flex-direction: column;
  width: calc(100% - 40px);
  z-index: 1;
}

.performance__payouts-wrapper {
  width: calc(100% - 40px);
  background: var(--color-8);
  z-index: -1;
  margin-top: -10px;
  border-radius: 0px 0px 30px 30px;
}

.performance__payouts {
 border-radius: 0px 0px 30px 30px;
}
</style>

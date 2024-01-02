<template>
  <div class="performance">
    <TokenDataPerformance class="performance__token-data" />
    <GraphicsPerformance class="performance__graphics" />
    <PortfolioPerformance class="performance__portfolio" />
  </div>
</template>

<script lang="ts">
import TokenDataPerformance from '@/modules/main/components/Performance/TokenData.vue';
import GraphicsPerformance from '@/modules/main/components/Performance/Graphics.vue';
import PortfolioPerformance from '@/modules/main/components/Performance/Portfolio.vue';

export default {
  name: 'PerformancePage',
  components: {
    TokenDataPerformance,
    GraphicsPerformance,
    PortfolioPerformance,
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
.performance__portfolio {
    width: 100%;
}
.performance__graphics,
.performance__portfolio {
    margin-top: 20px;
}
</style>

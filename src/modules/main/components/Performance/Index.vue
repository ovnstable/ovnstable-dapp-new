<template>
  <div class="performance">
    <TokenDataPerformance class="performance__token-data" />
    <GraphicsPerformance class="performance__graphics" />
  </div>
</template>

<script lang="ts">
import TokenDataPerformance from '@/modules/main/components/Performance/TokenData.vue';
import GraphicsPerformance from '@/modules/main/components/Performance/Graphics.vue'

export default {
  name: 'PerformancePage',
  components: {
    TokenDataPerformance,
    GraphicsPerformance,
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
.performance__graphics {
    width: 100%;
}
.performance__graphics {
    margin-top: 20px;
}
</style>

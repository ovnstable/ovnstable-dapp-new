<template>
  <div class="performance">
    <TokenDataPerformance class="performance__token-data" />
  </div>
</template>

<script lang="ts">
import TokenDataPerformance from '@/modules/main/components/Performance/TokenData.vue';

export default {
  name: 'PerformancePage',
  components: {
    TokenDataPerformance,
  },
};
</script>

<style>
.performance {
    display: flex;
    width: 100%;
    justify-content: center; /* Center the child horizontally */
    align-items: center; /* Center the child vertically */
}
.performance__token-data {
    width: 100%;
}

</style>

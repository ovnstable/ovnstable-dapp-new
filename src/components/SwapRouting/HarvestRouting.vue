<template>
  <LiquiditySegment
    :total-usd-value="zapPool?.rewards?.usdValue ?? '0'"
    :output-tokens="zapPool.rewards.tokensInfo"
    title="Harwest to rewards to wallet"
  />
</template>

<script lang="ts">
import LiquiditySegment from '@/components/SwapRouting/routingSegments/LiquiditySegment.vue';
import type { PropType } from 'vue';
import type { IPositionsInfo } from '@/types/positions';

export default {
  name: 'HarvestRouting',
  components: {
    LiquiditySegment,
  },
  props: {
    zapPool: {
      type: Object as PropType<IPositionsInfo>,
      required: true,
    },
  },
};
</script>

<style src="./styles.scss" lang="scss" scoped />

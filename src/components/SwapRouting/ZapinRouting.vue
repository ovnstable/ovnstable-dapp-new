<template>
  <SwapRoutingSegment
    :swap-data="swapData"
    :merged-list="mergedList"
    :input-tokens="inputTokens"
    :output-tokens="outputTokens"
  />
  <LiquiditySegment
    :swap-data="swapData"
    :output-tokens="outputTokens"
  />
</template>

<script lang="ts">
// TODO: Convert to ZapRouting and update imports
import SwapRoutingSegment from '@/components/SwapRouting/routingSegments/SwapRoutingSegment.vue';
import LiquiditySegment from '@/components/SwapRouting/routingSegments/LiquiditySegment.vue';

export default {
  name: 'ZapinRouting',
  components: {
    SwapRoutingSegment,
    LiquiditySegment,
  },
  props: {
    mergedList: {
      type: Array,
      required: true,
    },
    swapData: {
      type: Object,
      required: true,
    },
    inputTokens: {
      type: Array,
      required: true,
    },
    outputTokens: {
      type: Array,
      required: true,
    },
  },
};
</script>

  <style src="./styles.scss" lang="scss" scoped />

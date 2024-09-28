<template>
  <SwapRoutingSegment
    :swap-data="swapData"
    :input-tokens="inputTokens"
    :output-tokens="outputTokens"
  />

  <span class="divider" />

  <LiquiditySegment
    :total-usd-value="swapData?.netOutValue ?? '0'"
    :output-tokens="outputTokens"
  />
</template>

<script lang="ts">
import SwapRoutingSegment from '@/components/SwapRouting/routingSegments/SwapRoutingSegment.vue';
import LiquiditySegment from '@/components/SwapRouting/routingSegments/LiquiditySegment.vue';

export default {
  name: 'ZapinRouting',
  components: {
    SwapRoutingSegment,
    LiquiditySegment,
  },
  props: {
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

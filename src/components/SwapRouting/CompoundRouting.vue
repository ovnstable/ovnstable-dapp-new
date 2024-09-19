<template>
  <LiquiditySegment
    :total-usd-value="zapPool?.rewards?.usdValue ?? '0'"
    :output-tokens="zapPool.rewards.tokensInfo"
    title="Harwest to compound"
  />

  <span class="divider" />

  <SwapRoutingSegment
    :swap-data="swapData"
    :input-tokens="inputTokens"
    :output-tokens="outputTokens"
    title="Swap to compound"
  />

  <span class="divider" />

  <LiquiditySegment
    :total-usd-value="getLiquiditySum(outputTokens)"
    :output-tokens="outputTokens"
  />
</template>

<script lang="ts">
import SwapRoutingSegment from '@/components/SwapRouting/routingSegments/SwapRoutingSegment.vue';
import LiquiditySegment from '@/components/SwapRouting/routingSegments/LiquiditySegment.vue';
import type { PropType } from 'vue';
import type { IPositionsInfo } from '@/types/positions';
import { getLiquiditySum } from './helpers.ts';

export default {
  name: 'CompoundRouting',
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
    zapPool: {
      type: Object as PropType<IPositionsInfo>,
      required: true,
    },
  },
  data() {
    return {
      getLiquiditySum,
    };
  },
};
</script>

    <style src="./styles.scss" lang="scss" scoped />

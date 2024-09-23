<template>
  <NFTRowSegment
    title="Unstake LP"
    :nft-info="`ID: #${zapPool?.tokenId ?? '00000'}`"
  />

  <span class="divider" />

  <LiquiditySegment
    :total-usd-value="zapPool?.rewards?.usdValue ?? '0'"
    :output-tokens="zapPool.rewards.tokensInfo"
    title="Harvest to wallet"
  />

  <span class="divider" />

  <LiquiditySegment
    :total-usd-value="getLiquiditySum(outputTokens)"
    :output-tokens="outputTokens"
    title="Remove liquidity"
  />
</template>

<script lang="ts">
import LiquiditySegment from '@/components/SwapRouting/routingSegments/LiquiditySegment.vue';
import type { PropType } from 'vue';
import NFTRowSegment from './routingSegments/NFTRowSegment.vue';
import type { IPositionsInfo } from '@/types/positions';
import { getLiquiditySum } from './helpers.ts';

export default {
  name: 'RebalanceRouting',
  components: {
    LiquiditySegment,
    NFTRowSegment,
  },
  props: {
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

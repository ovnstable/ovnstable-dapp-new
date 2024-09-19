<template>
  <NFTRowSegment
    title="Unstake LP"
    :nft-info="`ID: #${zapPool?.tokenId ?? '00000'}`"
  />

  <span class="divider" />

  <LiquiditySegment
    :total-usd-value="swapData?.netOutValue ?? '0'"
    :output-tokens="outputTokens"
    title="Remove liquidity"
  />

  <span class="divider" />

  <LiquiditySegment
    :total-usd-value="zapPool?.rewards?.usdValue ?? '0'"
    :output-tokens="zapPool.rewards.tokensInfo"
    title="Harwest to wallet"
  />

  <span class="divider" />

  <SwapRoutingSegment
    :swap-data="swapData"
    :input-tokens="inputTokens"
    :output-tokens="outputTokens"
    title="Swap to rebalance"
  />

  <span class="divider" />

  <LiquiditySegment
    :total-usd-value="swapData?.netOutValue ?? '0'"
    :output-tokens="outputTokens"
    title="Add liquidity"
  />

  <span class="divider" />

  <NFTRowSegment
    title="Stake LP"
    nft-info="DBT NFT"
  />
</template>

<script lang="ts">
import SwapRoutingSegment from '@/components/SwapRouting/routingSegments/SwapRoutingSegment.vue';
import LiquiditySegment from '@/components/SwapRouting/routingSegments/LiquiditySegment.vue';
import type { PropType } from 'vue';
import NFTRowSegment from './routingSegments/NFTRowSegment.vue';
import type { IPositionsInfo } from '@/types/positions';

export default {
  name: 'RebalanceRouting',
  components: {
    SwapRoutingSegment,
    LiquiditySegment,
    NFTRowSegment,
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
};
</script>

  <style src="./styles.scss" lang="scss" scoped />

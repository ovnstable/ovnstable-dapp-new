<template>
  <div class="routing-wrap">
    <h1>Transaction route</h1>
    <div class="routing-wrap__content">
      <RebalanceRouting
        v-if="routingType === MODAL_TYPE.REBALANCE"
        :swap-data="swapData"
        :input-tokens="inputTokens"
        :output-tokens="outputTokens"
        :zap-pool="zapPool"
      />
      <IncreaseRouting
        v-if="routingType === MODAL_TYPE.INCREASE"
        :swap-data="swapData"
        :input-tokens="inputTokens"
        :output-tokens="outputTokens"
        :zap-pool="zapPool"
        :initial-position-tokens="initialPositionTokens"
      />
      <ZapinRouting
        v-else:
        :swap-data="swapData"
        :input-tokens="inputTokens"
        :output-tokens="outputTokens"
      />
    </div>
  </div>
</template>

<script lang="ts">
import ZapinRouting from '@/components/SwapRouting/ZapinRouting.vue';
import RebalanceRouting from '@/components/SwapRouting/RebalanceRouting.vue';
import { MODAL_TYPE } from '@/store/views/main/odos/index.ts';
import type { PropType } from 'vue';
import IncreaseRouting from './IncreaseRouting.vue';
import type { IPositionsInfo } from '@/types/positions';

export default {
  name: 'SwapRouting',
  components: {
    ZapinRouting,
    RebalanceRouting,
    IncreaseRouting,
  },
  props: {
    routingType: {
      type: Number as PropType<MODAL_TYPE> | null,
      required: false,
      default: null,
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
    zapPool: {
      type: Object as PropType<IPositionsInfo>,
      required: false,
      default: {} as IPositionsInfo,
    },
    // Specifically for Increase
    initialPositionTokens: {
      type: Array,
      required: false,
      default: [] as any,
    },
  },
  data() {
    return {
      MODAL_TYPE,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss" scoped />

<template>
  <div class="routing-wrap">
    <h1>Transaction route</h1>
    <div class="routing-wrap__content">
      <RebalanceRouting
        v-if="routingType === MODAL_TYPE.REBALANCE"
        :swap-data="swapData"
        :merged-list="mergedList"
        :input-tokens="inputTokens"
        :output-tokens="outputTokens"
      />
      <ZapinRouting
        v-else:
        :swap-data="swapData"
        :merged-list="mergedList"
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

export default {
  name: 'SwapRouting',
  components: {
    ZapinRouting,
    RebalanceRouting,
  },
  props: {
    routingType: {
      type: Number as PropType<MODAL_TYPE> | null,
      required: false,
      default: null,
    },
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
  data() {
    return {
      MODAL_TYPE,
    };
  },
};
</script>

<style src="./styles.scss" lang="scss" scoped />

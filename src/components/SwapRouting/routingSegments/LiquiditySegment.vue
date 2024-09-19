<template>
  <div
    v-if="outputTokens && outputTokens?.length > 0"
    class="routing-wrap__content-col"
  >
    <div class="routing-wrap__row routing-wrap__row--title">
      <h2 class="routing-segment-title">
        {{ title }}
      </h2>
      <span>{{ getOutputUsd(totalUsdValue) }}$</span>
    </div>
    <div class="routing-wrap__content-col">
      <div
        v-for="(item, key) in (outputTokens as any)"
        :key="key"
        class="routing-wrap__row routing-wrap__row--liq"
      >
        <div class="routing-wrap__row-item">
          <img
            :src="item?.selectedToken?.logoUrl"
            alt="logourl"
          />
          <span>
            {{ item?.selectedToken?.symbol }}
          </span>
        </div>
        <div class="routing-wrap__row-item">
          <span>
            {{ getToken(item.sum) }}
          </span>
          <span class="secondary">
            ${{ getTokenUsd(item) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getOutputUsd, getTokenUsd, getToken } from '@/components/SwapRouting/helpers.ts';

export default {
  name: 'LiquiditySegment',
  components: {
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Add liquidity',
    },
    totalUsdValue: {
      type: String,
      required: true,
    },
    outputTokens: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      getOutputUsd, getTokenUsd, getToken,
    };
  },
};
</script>
<style src="../styles.scss" lang="scss" scoped />

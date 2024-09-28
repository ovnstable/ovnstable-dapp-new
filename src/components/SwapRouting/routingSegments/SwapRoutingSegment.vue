<template>
  <div
    v-if="swapData && swapData?.blockNumber"
    class="routing-wrap__content-col"
  >
    <h2 class="routing-segment-title">
      {{ title }}
    </h2>
    <div class="routing-wrap__row">
      <h2>Value difference ($)</h2>
      <span
        :class="{
          red: isBiggerZero(getSwapPrice),
        }"
      >{{ getSwapPrice }}$</span>
    </div>
    <div class="routing-wrap__row">
      <div class="routing-wrap__row">
        <div class="routing-wrap__content-col">
          <div
            v-for="(inputT, key) in inputTokens as any"
            :key="key"
            class="routing-wrap__row-item"
          >
            <img
              :src="inputT?.selectedToken?.logoUrl"
              alt="logourl"
            />
            <span>
              {{ getToken(inputT.value) }}
            </span>
            <span class="secondary">
              ${{ getTokenUsd(inputT) }}
            </span>
          </div>
        </div>
        <BaseIcon
          name="ArrowRightPath"
        />
        <div class="routing-wrap__content-col">
          <div
            v-for="(item, key) in outputTokens as any"
            :key="key"
            class="routing-wrap__row-item"
          >
            <img
              :src="item?.selectedToken?.logoUrl"
              alt="logourl"
            />
            <span>
              {{ getToken(item.sum) }}
            </span>
            <span class="secondary">
              $
              ${{ getTokenUsd(item) }}
            </span>
          </div>
        </div>
      </div>
      <div class="routing-wrap__row">
        <h2>via Odos</h2>

        <BaseIcon
          name="OdosLogo"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BN from 'bignumber.js';
import { formatMoney, getFixed } from '@/utils/numbers.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { getTokenUsd, getToken } from '@/components/SwapRouting/helpers.ts';

export default {
  name: 'SwapRoutingSegment',
  components: {
    BaseIcon,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Swap',
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
      getTokenUsd, getToken,
    };
  },
  computed: {
    isBiggerZero() {
      return (val: string) => new BN(val).gt(0);
    },
    getSwapPrice() {
      const inputUsd = this.swapData.inValues
        .reduce((acc: BN, curr: string) => acc.plus(curr), new BN(0));
      const outputUsd = this.swapData.outValues
        .reduce((acc: BN, curr: string) => acc.plus(curr), new BN(0));

      const diff = inputUsd.minus(outputUsd).toFixed();

      return diff && new BN(diff).gt(0) ? formatMoney(diff, getFixed(diff)) : 0;
    },
  },
};
</script>

  <style src="../styles.scss" lang="scss" scoped />

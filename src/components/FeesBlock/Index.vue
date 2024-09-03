<template>
  <div class="slippage-block">
    <div
      class="transaction-info-container"
    >
      <div class="transaction-info-body">
        <div
          class="zap-row"
        >
          <div class="transaction-info-title">
            Slippage
          </div>
          <div class="transaction-info">
            {{ slippagePercent * 1 }}%
            <span class="transaction-info-additional">
              ({{ formatMoney(getSlippageAmount, 3) }})$
            </span>
          </div>
        </div>

        <div
          v-if="selectedInputTokens?.length > 1"
          class="zap-row"
        >
          <div class="transaction-info-title">
            Multi-swap Odos fee
          </div>
          <div class="transaction-info">
            {{ multiSwapOdosFeePercent * 1 }}%
            <span class="transaction-info-additional">
              ({{ formatMoney(getOdosFee, 3) }})$
            </span>
          </div>
        </div>

        <div class="zap-row">
          <div class="transaction-info-title">
            Single-swap Odos fee
          </div>
          <div class="transaction-info">
            0.00% <span class="transaction-info-additional">(0)$</span>
          </div>
        </div>

        <div class="zap-row">
          <div class="transaction-info-title">
            Output min. received
          </div>
          <div class="transaction-info">
            <span>
              ~{{ getFixed(odosData?.netOutValue) }}$
            </span>
            <span
              :class="{ 'tx-info--red': critImpact(odosData.priceImpact ?? 0) }"
            >
              ({{ getFixedPrice(odosData.priceImpact) }}%)
            </span>
          </div>
        </div>

        <div class="zap-row">
          <div class="transaction-info-title">
            Agree with min. received
          </div>
          <SwitchComponent
            :is-checked="agreeWithFees"
            @change-switch="changeAgree"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { formatMoney } from '@/utils/numbers.ts';
import BN from 'bignumber.js';
import SwitchComponent from '@/components/Switch/Index.vue';

export const MIN_IMPACT = 2;

export default {
  name: 'FeesBlock',
  components: {
    SwitchComponent,
  },
  props: {
    slippagePercent: {
      type: Number,
      required: true,
    },
    getOdosFee: {
      type: Number,
      required: true,
    },
    multiSwapOdosFeePercent: {
      type: Number,
      required: true,
    },
    selectedInputTokens: {
      type: Array,
      required: true,
    },
    getSlippageAmount: {
      type: Number,
      required: true,
    },
    odosData: {
      type: Object,
      required: true,
    },
    agreeWithFees: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['change-agree'],
  computed: {
    getFixed() {
      return (val: string) => (new BN(val).gt(0)
        ? new BN(val).times(1 - this.slippagePercent / 100).toFixed(2) : 0);
    },
    critImpact() {
      return (val: string) => (!!new BN(val).absoluteValue().gt(MIN_IMPACT));
    },
    getFixedPrice() {
      return (val: string) => {
        if (new BN(val).eq(0)) return 0;
        if (new BN(val).absoluteValue().lt(0.0001)) return 0;
        if (new BN(val).absoluteValue().lt(0.001)) {
          return new BN(val).toFixed(4);
        }

        return new BN(val).toFixed(2);
      };
    },
  },
  methods: {
    formatMoney,
    changeAgree() {
      this.$emit('change-agree');
    },
  },
};
</script>

<style lang="scss">
.transaction-info-title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  color: #707a8b;
}

.tx-info--red {
  color: rgb(243, 57, 57);
}

.transaction-info {
  display: flex;
  gap: 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: end;
  color: var(--main-gray-text);
}

.transaction-info-additional {
  font-style: normal;
  font-weight: 200;
  font-size: 16px;
  line-height: 24px;

  color: var(--main-gray-text);
}

.transaction-info-address {
  text-decoration: underline;
  font-weight: bold;
  text-align: end;
  color: var(--main-gray-text);
}

.transaction-info-footer {
  border-top: 1px solid #dee1e5;
  padding-top: 22px;
}

.zap-row {
  display: flex;
  justify-content: space-between;
}
</style>

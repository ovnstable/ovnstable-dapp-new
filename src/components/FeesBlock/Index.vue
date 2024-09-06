<template>
  <div class="slippage-block">
    <div
      class="transaction-info-container"
    >
      <div class="transaction-info-body">
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

        <div
          class="zap-row"
        >
          <div class="transaction-info-title">
            Input Token Value (USD)
          </div>
          <div class="transaction-info">
            <span>
              ~{{ getTotal(getInputUsdValue) }}$
            </span>
          </div>
        </div>
        <div
          v-if="v3Pool"
          class="zap-row"
        >
          <div class="transaction-info-title">
            Output Token Value (USD)
          </div>
          <div class="transaction-info">
            <span>
              ~{{ getTotal(getOutputValue) }}$
            </span>
          </div>
        </div>
        <div
          class="zap-row"
        >
          <div class="transaction-info-title">
            Value difference (%)
          </div>
          <div class="transaction-info">
            <span
              :class="{
                'tx-info--red': critImpact(odosData.percentDiff ?? 0),
                'tx-info--green': !critImpact(odosData.percentDiff ?? 0),
              }"
            >
              (-{{ getFixedPrice(odosData.percentDiff) }}%)
            </span>
          </div>
        </div>

        <div
          class="zap-row zap-row--mt"
        >
          <div class="transaction-info-title">
            Agree with swap terms
          </div>
          <SwitchComponent
            :is-checked="agreeWithFees"
            @change-switch="changeAgree"
          />
        </div>
        <template
          v-if="v3Pool"
        >
          <div
            v-for="(item, key) in selectedOutputTokens as any"
            :key="key"
            class="zap-row"
          >
            <div class="transaction-info-title">
              Minimum received Token {{ key + 1 }}
            </div>
            <div class="transaction-info">
              <span>
                {{ getToken(item.sum) }} {{ item.selectedToken.symbol }}
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { fixedByPrice, formatMoney } from '@/utils/numbers.ts';
import BN from 'bignumber.js';
import SwitchComponent from '@/components/Switch/Index.vue';

export const MIN_IMPACT = 2;

export default {
  name: 'FeesBlock',
  components: {
    SwitchComponent,
  },
  props: {
    getOdosFee: {
      type: Number,
      required: true,
    },
    poolVersion: {
      type: String,
      default: 'v3',
      required: false,
    },
    slippagePercent: {
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
    selectedOutputTokens: {
      type: Array,
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
    getOutputValue() {
      return new BN(this.odosData?.netOutValue).gt(this.getInputUsdValue)
        ? this.getInputUsdValue : this.odosData?.netOutValue;
    },
    v3Pool() {
      return this.poolVersion === 'v3';
    },
    getTotal() {
      return (val: string) => {
        if (new BN(val).eq(0)) return 0;

        return formatMoney(Number(val), this.getFixed(val));
      };
    },
    critImpact() {
      return (val: string) => (!!new BN(val).absoluteValue().gt(MIN_IMPACT));
    },
    getInputUsdValue() {
      const val = this.selectedInputTokens
        .reduce((acc: BN, curr:any) => acc.plus(curr.usdValue), new BN(0));

      return val.gt(10) ? val.toFixed(0) : val.toFixed(4);
    },
    getToken() {
      return (val: string) => {
        if (new BN(val).eq(0)) return 0;
        const valTotal = new BN(val).times(1 - this.slippagePercent / 100);
        const fixedAm = this.getFixed(val);
        return formatMoney(Number(valTotal), fixedAm);
      };
    },
    getFixed() {
      return (val: string) => {
        let fixed = 2;

        if (new BN(val).gt(10000)) fixed = 0;
        if (new BN(val).lt(0.1)) fixed = fixedByPrice(Number(val));

        return fixed;
      };
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

.zap-row--mt {
  margin-top: 12px;
}

.tx-info--red {
  color: rgb(243, 57, 57);
}

.tx-info--green {
  color: rgb(95, 233, 67);
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

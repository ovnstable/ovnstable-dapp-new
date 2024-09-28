<template>
  <div class="transaction-block">
    <h1 class="transaction-info-heading">
      Agree with swap terms
    </h1>
    <div
      class="transaction-info-container"
    >
      <div class="transaction-info-body">
        <div class="transaction-info-row-container">
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
            <div
              v-if="isLoading"
              class="lineLoader lineLoader--balance lineLoader--balance-orig"
            />
            <div
              v-else
              class="transaction-info"
            >
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
            <div
              v-if="isLoading"
              class="lineLoader lineLoader--balance lineLoader--balance-orig"
            />
            <div
              v-else
              class="transaction-info"
            >
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
            <div
              v-if="isLoading"
              class="lineLoader lineLoader--balance lineLoader--balance-orig"
            />
            <div
              v-else
              class="transaction-info"
            >
              <span
                :class="{
                  'tx-info--red': critImpact(getValueDiff) === 'red',
                  'tx-info--yellow': critImpact(getValueDiff) === 'yellow',
                }"
              >
                (-{{ getValueDiff }}%)
              </span>
            </div>
          </div>
        </div>
        <span class="divider" />
        <template
          v-if="v3Pool"
        >
          <div class="transaction-info-row-container">
            <div
              v-for="(item, key) in getOutTokens as any"
              :key="key"
              class="zap-row"
            >
              <div class="transaction-info-title">
                Minimum received Token {{ key + 1 }}
              </div>
              <div
                v-if="isLoading"
                class="lineLoader lineLoader--balance lineLoader--balance-orig"
              />
              <div
                v-else
                class="transaction-info"
              >
                <span>
                  {{ getToken(item.sum) }} {{ item.selectedToken.symbol }}
                </span>
              </div>
            </div>
          </div>
        </template>

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
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { formatMoney, getFixed } from '@/utils/numbers.ts';
import BN from 'bignumber.js';
import SwitchComponent from '@/components/Switch/Index.vue';
import { countPercentDiff } from '@/services/Web3Service/utils/index.ts';

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
    currentPositionTokens: {
      type: Array,
      required: false,
      default: (() => []),
    },
    odosData: {
      type: Object,
      required: true,
    },
    agreeWithFees: {
      type: Boolean,
      required: false,
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['change-agree'],
  computed: {
    getOutTokens() {
      return this.selectedOutputTokens;
    },
    getValueDiff() {
      if (!this.getInputUsdValue || !this.getOutputValue) return '0';
      if (new BN(this.getInputUsdValue).eq(0) || new BN(this.getOutputValue).eq(0)) return '0';
      if (this.currentPositionTokens.length > 0) {
        return this
          .getFixedPrice(countPercentDiff(this.getInputUsdValue, this.getOutputValue));
      }

      return this.getFixedPrice(this.odosData.percentDiff);
    },
    getOutputValue() {
      if (!this.odosData?.inValues) return '0';

      const inputUsd = this.odosData.inValues
        .reduce((acc: BN, curr: string) => acc.plus(curr), new BN(0));
      const outputUsd = this.odosData.outValues
        .reduce((acc: BN, curr: string) => acc.plus(curr), new BN(0));
      const diff = inputUsd.minus(outputUsd).abs().toFixed();
      const total = new BN(this.getInputUsdValue).minus(diff).toFixed();

      return total;
    },
    v3Pool() {
      return this.poolVersion === 'v3';
    },
    getTotal() {
      return (val: string) => {
        if (new BN(val).eq(0)) return 0;

        return formatMoney(Number(val), getFixed(val));
      };
    },
    critImpact() {
      return (val: string | number) => {
        if ((new BN(val).absoluteValue().eq(0))) return '';
        if ((new BN(val).absoluteValue().gt(MIN_IMPACT))) return 'red';
        return 'yellow';
      };
    },
    getInputUsdValue() {
      if (!this.odosData?.inValues) return '0';

      let currPosValue = new BN(0);

      if (this.currentPositionTokens.length > 0) {
        currPosValue = this.currentPositionTokens
          .reduce((acc: BN, curr: any) => acc
            .plus(new BN(curr.sum).times(curr.selectedToken?.price)), new BN(0));
      }

      const inputUsd = this.selectedInputTokens
        .reduce((acc: BN, curr: any) => acc
          .plus(curr.usdValue ?? 0), new BN(0));

      if (this.currentPositionTokens.length > 0) {
        currPosValue = this.currentPositionTokens
          .reduce((acc: BN, curr: any) => acc
            .plus(new BN(curr.sum).times(curr.selectedToken?.price)), new BN(0));
      }

      const val = inputUsd.plus(currPosValue);

      return val.toFixed(getFixed(val.toFixed()));
    },
    getToken() {
      return (val: string) => {
        if (new BN(val).eq(0)) return 0;
        const valTotal = new BN(val).times(1 - this.slippagePercent / 100);
        const fixedAm = getFixed(val);
        return formatMoney(Number(valTotal), fixedAm);
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
.transaction-block {
  margin-bottom: auto;
}

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

.tx-info--yellow {
  color: rgb(255, 196, 0);
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
  align-items: center;
  justify-content: space-between;
}

.transaction-info-container {
  background-color: var(--color-4);
  border: 1px solid var(--color-3);
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
    [data-theme="dark"] & {
      background-color: var(--color-6);
      border: 1px solid var(--color-3);
    }
}

.divider {
  display: block;
  width: 100%;
  height: 1px;
  background-color: var(--color-7);
}

.transaction-info-heading {
  margin-bottom: 10px;
  font-size: 15px;
}

.transaction-info-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-info-row-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>

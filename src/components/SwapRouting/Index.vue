<template>
  <div class="routing-wrap">
    <h1>Transaction route</h1>
    <div class="routing-wrap__content">
      <div
        v-if="swapData && swapData?.blockNumber"
        class="routing-wrap__content-col"
      >
        <div class="routing-wrap__row">
          <h2>Swap to zapin</h2>
          <span class="red">{{ getSwapPrice }}$</span>
        </div>
        <div class="routing-wrap__row">
          <div class="routing-wrap__row">
            <div class="routing-wrap__content-col">
              <div
                v-for="(inputT, key) in inputSwapList(swapData)"
                :key="key"
                class="routing-wrap__row-item"
              >
                <img
                  :src="inputT?.tokenData?.logoUrl"
                  alt="logourl"
                />
                <span>
                  {{ getFormattedVal(inputT.val) }}
                </span>
                <span class="secondary">
                  ${{ getFormattedVal(inputT.usdVal) }}
                </span>
              </div>
            </div>
            <BaseIcon
              name="ArrowRightPath"
            />
            <div class="routing-wrap__content-col">
              <div
                v-for="(inputT, key) in outputSwapList(swapData)"
                :key="key"
                class="routing-wrap__row-item"
              >
                <img
                  :src="inputT?.tokenData?.logoUrl"
                  alt="logourl"
                />
                <span>
                  {{ getFormattedVal(inputT.val) }}
                </span>
                <span class="secondary">
                  $
                  {{ getFormattedVal(inputT.usdVal) }}
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
      <div
        v-if="outputTokens && outputTokens?.length > 0"
        class="routing-wrap__content-col"
      >
        <div class="routing-wrap__row routing-wrap__row--title">
          <h2>Add liquidity</h2>
          <span>{{ getOutputUsd }}$</span>
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
    </div>
  </div>
</template>

<script lang="ts">
import { getTokenByAddress } from '@/store/helpers/index.ts';
import BN from 'bignumber.js';
import { formatMoney, getFixed } from '@/utils/numbers.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'SwapRouting',
  components: {
    BaseIcon,
  },
  // list of possible transactions, different manage functions, have different flow
  // if smth new, add in props and pass it to template
  props: {
    mergedList: {
      type: Array,
      required: true,
    },
    swapData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    outputTokens: {
      type: Array,
      required: false,
      default: () => ([]),
    },
  },
  computed: {
    getOutputUsd() {
      const outputUsd: string = this.swapData?.netOutValue;

      return new BN(outputUsd).gt(0) ? `-${formatMoney(outputUsd, getFixed(outputUsd))}` : 0;
    },
    getSwapPrice() {
      const inputUsd = this.inputSwapList(this.swapData)
        .reduce((acc: any, curr: any) => acc.plus(curr.usdVal), new BN(0));
      const outputUsd = this.swapData?.netOutValue;

      const diff = inputUsd.minus(outputUsd).toFixed();

      return new BN(diff).gt(0) ? `-${formatMoney(diff, getFixed(diff))}` : 0;
    },
    inputSwapList() {
      return (swapD: any) => swapD.inTokens.map((_: string, i: number) => {
        const tokenData = getTokenByAddress(_, this.mergedList);
        const origVal = new BN(swapD?.inAmounts[i]).div(10 ** tokenData.decimals).toFixed();
        const usdVal = new BN(origVal).times(tokenData.price).toFixed();

        return {
          tokenData,
          usdVal,
          val: origVal,
        };
      });
    },
    outputSwapList() {
      return (swapD: any) => swapD.outTokens.map((_: string, i: number) => {
        const tokenData = getTokenByAddress(_, this.mergedList);
        const origVal = new BN(swapD?.outAmounts[i]).div(10 ** tokenData.decimals).toFixed();
        const usdVal = new BN(swapD?.outValues[i]).toFixed();

        return {
          tokenData,
          usdVal,
          val: origVal,
        };
      });
    },
    getTokenUsd() {
      return (val: any) => {
        if (new BN(val).eq(0)) return 0;
        const usdVal = new BN(val.sum).times(val?.selectedToken?.price).toFixed();

        return formatMoney(usdVal, getFixed(usdVal));
      };
    },
    getToken() {
      return (val: string) => {
        if (new BN(val).eq(0)) return 0;
        return formatMoney(val, getFixed(val));
      };
    },
    getFormattedVal() {
      return (val: string) => formatMoney(val, getFixed(val));
    },
  },
  mounted() {
    console.log(this.outputSwapList(this.swapData), '__INPUT');
  },
};
</script>

<style lang="scss" scoped>
.routing-wrap {
  margin-top: 20px;
}

h1 {
  margin-bottom: 10px;
}

.red {
  color: var(--color-10);
  font-weight: 700;
  font-size: 14px;
}

.routing-wrap__content {
  background-color: var(--color-4);
  border: 1px solid var(--color-3);
  padding: 20px;
  border-radius: 20px;
}

.routing-wrap__content-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.routing-wrap__row--title {
  margin-top: 20px;
}

.routing-wrap__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.routing-wrap__row-item {
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
  }
}

.routing-prices {
  display: flex;
  gap: 6px;
}

.routing-wrap__row--liq {
  justify-content: space-between;
  width: 100%;
}

.secondary {
  color: var(--color-19);
}
</style>

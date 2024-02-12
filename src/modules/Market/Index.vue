<template>
  <div class="market-wrapper">
    <div
      v-if="!loaded"
      class="market__loader"
    >
      <Spinner />
    </div>
    <div
      v-else
    >
      <div class="market">
        <TokenDataPerformance
          :token-data="tokenData"
          class="market__token-data"
        />
        <GraphicsPerformance
          :payout-data="payoutData"
          :token-data="tokenData"
          class="market__graphics"
        />
        <PortfolioPerformance
          :portfolio-data="portfolioData"
          :collateral-data="collateralData"
          class="market__portfolio"
        />
      </div>
      <div class="market__payouts">
        <PortfolioPayouts
          :payout-data="payoutData"
          class="market__payout-inner"
        />
      </div>
    </div>

  </div>

</template>

<script lang="ts">
import TokenDataPerformance from '@/modules/Market/TokenData.vue';
import GraphicsPerformance from '@/modules/Market/Graphics.vue';
import PortfolioPerformance from '@/modules/Market/Portfolio.vue';
import PortfolioPayouts from '@/modules/Market/Payouts.vue';
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'MarketPage',
  props: {
    tokenData: {
      type: Object,
      default: () => ({}),
    },
    portfolioData: {
      type: Object,
      default: () => ({}),
    },
    collateralData: {
      type: Object,
      default: () => ({}),
    },
    payoutData: {
      type: Object,
      default: () => ({}),
    },
    loaded: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TokenDataPerformance,
    GraphicsPerformance,
    PortfolioPerformance,
    PortfolioPayouts,
    Spinner,
  },
};
</script>

<style lang="scss" scoped>
.market {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid var(--color-1);
  background: var(--color-4);
  box-shadow: 0px 1px 0px 0px var(--color-1);
  padding-top: 40px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 20px;
  width: calc(100% - 40px);
  [data-theme="dark"] & {
      background: var(--color-6);
  }
}
.market__token-data,
.market__graphics,
.market__portfolio,
.market__payout-inner {
  width: 100%;
}
.market__graphics{
  margin-top: 20px;
}

.market-wrapper {
  display: flex;
  flex-direction: column;
  width: calc(100% - 40px);
  min-height: 1500px;
  z-index: 1;
}

.market__payouts {
  width: calc(100% - 40px);
  background: var(--color-8);
  z-index: -1;
  margin-top: -10px;
  border-radius: 0px 0px 30px 30px;
}

.market__payout-inner {
  border-radius: 0px 0px 30px 30px;
}
.market__loader {
  margin: auto;
  height: 80%;
  min-height: 474px;
  display: flex;
}
</style>

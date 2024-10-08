<template>
  <div
    v-if="firstLoad"
    class="market__loader"
  >
    <Spinner />
  </div>
  <div
    v-else
    class="page-wrapper"
  >
    <Sidebar />
    <div
      class="market-wrapper"
    >
      <div class="market">
        <TokenDataPerformance
          :token-data="tokenData"
          class="market__token-data"
        />
        <GraphicsPerformance
          :payout-data="payoutData"
          :token-data="tokenData"
          :loaded="loaded"
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
import Sidebar from '@/components/Layout/Sidebar/Index.vue';

export default {
  name: 'MarketPage',
  components: {
    TokenDataPerformance,
    GraphicsPerformance,
    PortfolioPerformance,
    PortfolioPayouts,
    Spinner,
    Sidebar,
  },
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
    firstLoad: {
      type: Boolean,
      required: true,
    },
    loaded: {
      type: Boolean,
      default: false,
    },
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
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-17);
    border-color: var(--color-2);
    box-shadow: 0px 1px 0px 0px var(--color-2);
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
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(100% - 40px);
  min-height: 1500px;
  z-index: 1;
}

.market__payouts {
  width: 100%;
  background: var(--color-8);
  z-index: -1;
  margin-top: -10px;
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.market__payout-inner {
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.market__loader {
  left: 10px;
  top: 0;
  margin: auto;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, .4);

  [data-theme="dark"] & {
    background-color: var(--color-19);
  }
}
@media (max-width: 1080px) {
  .market {
    padding-left: 5px;
    padding-right: 5px;
  }
}

@media (max-width: 1024px) {
   .market,
  .market__payouts {
    width: 100%;
  }
  .market-wrapper  {
    width: 100%;
    align-items: center;
    margin-bottom: 150px;
  }
}

@media (max-width: 768px) {
  .market,
  .market__payouts {
    width: 100%;
  }
  .market-wrapper  {
    width: 100%;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .market__payouts,
  .market-wrapper,
  .market {
    width: 100%;
  }
  .market {
    padding-top: 16px;
    padding-left: 20px;
    padding-right: 20px
  }
  .market-wrapper {
    margin-left: 0;
    margin-bottom: 0;
  }
  .market__graphics{
    margin-top: 24px;
  }
}
.page-wrapper {
  display: flex;
  flex-direction: row;
  gap: 50px;
  margin-top: 24px;
}
</style>

<template>
  <div class="market-wrapper">
    <div class="market">
      <TokenDataPerformance class="market__token-data" />
      <GraphicsPerformance class="market__graphics" />
      <PortfolioPerformance class="market__portfolio" />
    </div>
    <div class="market__payouts">
      <PortfolioPayouts class="market__payout-inner" />
    </div>
  </div>

</template>

<script lang="ts">
import TokenDataPerformance from '@/modules/main/components/Market/TokenData.vue';
import GraphicsPerformance from '@/modules/main/components/Market/Graphics.vue';
import PortfolioPerformance from '@/modules/main/components/Market/Portfolio.vue';
import PortfolioPayouts from '@/modules/main/components/Market/Payouts.vue';

export default {
  name: 'MarketPage',
  components: {
    TokenDataPerformance,
    GraphicsPerformance,
    PortfolioPerformance,
    PortfolioPayouts,
  },
};
</script>

<style>
.market {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 20px;
  border: 1px solid var(--color-1);
  background: var(--color-4);
  box-shadow: 0px 1px 0px 0px var(--color-1);
  padding-top: 40px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 20px;
  width: calc(100% - 40px);
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
</style>

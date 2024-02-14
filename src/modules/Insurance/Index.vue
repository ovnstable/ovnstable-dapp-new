<template>
  <div
    v-if="firstLoad"
    class="insurance__loader"
  >
    <Spinner />
  </div>
  <div
    v-else
    class="insurance-wrapper"
  >
    <Transition name="slide-fade">
      <div
        v-if="!loaded"
        class="insurance__loader"
      >
        <Spinner />
      </div>

    </Transition>
    <div
      class="insurance"
    >
      <TokenDataInsurance
        :tokenData="tokenData"
        class="market__token-data"
      />
      <GraphicsPerformance
        :payoutData="payoutData"
        class="insurance__graphics"
      />
      <p class="insurance__portfolio">portfolio data</p>
    </div>
    <div class="insurance__payouts">
      <p class="insurance__payout-inner">token datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatoken datatatoken data</p>
    </div>
  </div>

</template>

<script lang="ts">
import TokenDataInsurance from '@/modules/Insurance/TokenData.vue';
import GraphicsPerformance from '@/modules/Insurance/Graphic.vue';
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'InsurancePage',
  components: {
    TokenDataInsurance,
    GraphicsPerformance,
    Spinner,
  },
  props: {
    tokenData: {
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
.insurance {
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
    border-color: var(--color-2);
    box-shadow: 0px 1px 0px 0px var(--color-2);
  }
}
.insurance__token-data,
.insurance__graphics,
.insurance__portfolio,
.insurance__payout-inner {
  width: 100%;
}
.insurance__graphics{
  margin-top: 20px;
}

.insurance-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(100% - 40px);
  min-height: 1500px;
  z-index: 1;
}

.insurance__payouts {
  width: calc(100% - 40px);
  background: var(--color-8);
  z-index: -1;
  margin-top: -10px;
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.insurance__payout-inner {
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.insurance__loader {
  position: absolute;
  left: 0;
  top: 0;
  margin: auto;
  height: 100%;
  width: 100%;
  min-height: 474px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, .4);
  padding-bottom: 50vh;
}

</style>

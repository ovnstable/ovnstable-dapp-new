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
    <div
      class="insurance"
    >
      <TokenDataInsurance
        :tokenData="tokenData"
        class="insurance__token-data"
      />
      <GraphicsInsurance
        v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem
          && !insuranceIsMobileOvnDashboard"
        :payoutData="payoutData"
        :loaded="loaded"
        class="insurance__graphics"
      />
      <InsurancePremiums
        v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem
          && !insuranceIsMobileOvnDashboard"
        :premiums-data="premiumsData"
        class="insurance__premiums"
      />
    </div>
    <div
      v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem
        && !insuranceIsMobileOvnDashboard"
      class="insurance__payouts"
    >
      <InsurancePayouts
        :payout-data="reversedPayoutData"
        class="insurance__payout-inner"
      />
    </div>
  </div>

</template>

<script lang="ts">
import TokenDataInsurance from '@/modules/Insurance/TokenData.vue';
import GraphicsInsurance from '@/modules/Insurance/Graphic.vue';
import Spinner from '@/components/Spinner/Index.vue';
import InsurancePremiums from '@/modules/Insurance/Premiums.vue';
import InsurancePayouts from '@/modules/Insurance/InsurancePayouts.vue';

export default {
  name: 'InsurancePage',
  components: {
    TokenDataInsurance,
    InsurancePremiums,
    GraphicsInsurance,
    InsurancePayouts,
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
    premiumsData: {
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
  computed: {
    reversedPayoutData() {
      return [...this.payoutData.payouts].reverse();
    },
    insuranceIsMobileMintRedeem() {
      return this.$store.state.insuranceTokenData.isMobileMintRedeem.value;
    },
    insuranceIsMobileAboutOvn() {
      return this.$store.state.insuranceTokenData.isMobileAboutOvn.value;
    },
    insuranceIsMobileOvnDashboard() {
      return this.$store.state.insuranceTokenData.isMobileOvnDashboard.value;
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
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-17);
    border-color: var(--color-2);
    box-shadow: 0px 1px 0px 0px var(--color-2);
  }
}
.insurance__token-data,
.insurance__graphics,
.insurance__premiums,
.insurance__payout-inner {
  width: 100%;
}

.insurance__graphics {
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.insurance__graphics{
  margin-top: 24px;
  padding: 18px 24px;
  border-radius: 5px;
  border: 1px solid var(--color-1);
}
.insurance__premiums {
  margin-top: 20px;
}
.insurance-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 1500px;
  z-index: 1;
}

.insurance__payouts {
  width: 100%;
  background: var(--color-8);
  z-index: -1;
  margin-top: -10px;
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    background-color: var(--color-6);
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
  left: 10px;
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
  [data-theme="dark"] & {
    background-color: var(--color-19);
  }
}
@media (max-width: 768px) {
  .insurance__graphics {
    padding: 8px 12px;
  }

  .insurance,
  .insurance__payouts {
    width: calc(100% - 40px);
  }
  .insurance-wrapper {
    align-items: center;
  }
}

@media (max-width: 400px) {
  .insurance,
  .insurance__payouts,
  .insurance__payout-inner {
    width: 100%;
  }
  .insurance-wrapper {
    height: 100%;
  }

  .insurance {
    padding: 16px 20px;
  }
  .insurance__payout-inner {
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 0;
  }
  .insurance__graphics {
    padding: 0;
    margin-top: 14px;
    border: none;
  }
}

</style>

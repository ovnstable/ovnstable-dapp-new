<template>
  <div
    v-if="firstLoad"
    class="insurance__loader"
  >
    <Spinner />
  </div>
  <div
    v-else-if="device.isDesktop"
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
        v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem"
        :payoutData="payoutData"
        :loaded="loaded"
        class="insurance__graphics"
      />
      <InsurancePremiums
        v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem"
        :premiums-data="premiumsData"
        class="insurance__premiums"
      />
    </div>
    <div
      v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem"
      class="insurance__payouts"
    >
      <InsurancePayouts
        :payout-data="reversedPayoutData"
        class="insurance__payout-inner"
      />
    </div>
  </div>
  <div
    v-else-if="!device.isDesktop"
    class="insurance-wrapper"
  >

    <TabsComponent
      :tabs="tabsData"
      :active-tab="activeTab"
      @tab-change="changeTab"
      class="insurance-tabs"
    >
      <div
        v-if="activeTab === 0"
        class="insurance-usd-plus-wrap"
      >
        <div class="insurance">
          <TokenDataInsurance
            :tokenData="tokenData"
            class="insurance__token-data"
          />
          <GraphicsInsurance
            v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem"
            :payoutData="payoutData"
            :loaded="loaded"
            class="insurance__graphics"
          />
          <InsurancePremiums
            v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem"
            :premiums-data="premiumsData"
            class="insurance__premiums"
          />
        </div>
        <div
          v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem"
          class="insurance__payouts"
        >
          <InsurancePayouts
            :payout-data="reversedPayoutData"
            class="insurance__payout-inner"
          />
        </div>

      </div>
      <div
        v-if="activeTab === 1"
        class="insurance-tokens-plus-wrap"
      >
        <OvnPage
          :token-data="ovnTokenData"
          :first-load="firstLoad"
          :loaded="loadedDataDashboard"
        />
      </div>
    </TabsComponent>

  </div>

</template>

<script lang="ts">
import TokenDataInsurance from '@/modules/Insurance/TokenData.vue';
import GraphicsInsurance from '@/modules/Insurance/Graphic.vue';
import Spinner from '@/components/Spinner/Index.vue';
import TabsComponent from '@/components/Tabs/Index.vue';
import OvnPage from '@/modules/Ovn/Index.vue';
import InsurancePremiums from '@/modules/Insurance/Premiums.vue';
import { deviceType } from '@/utils/deviceType.ts';
import InsurancePayouts from '@/modules/Insurance/InsurancePayouts.vue';

export default {
  name: 'InsurancePage',
  components: {
    TokenDataInsurance,
    InsurancePremiums,
    GraphicsInsurance,
    InsurancePayouts,
    Spinner,
    TabsComponent,
    OvnPage,
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
  data() {
    return {
      tabsData: [
        {
          id: 0,
          name: 'INSURANCE',
        },
        {
          id: 1,
          name: 'OVN OVERVIEW',
        },
      ],
      activeTab: 0,
      loadedDataDashboard: false,
    };
  },
  computed: {
    device() {
      return deviceType();
    },
    ovnTokenData() {
      return this.$store.state.ovnTokenData.ovnTokenData || {};
    },
    reversedPayoutData() {
      return [...this.payoutData.payouts].reverse();
    },
    insuranceIsMobileMintRedeem() {
      return this.$store.state.insuranceTokenData.isMobileMintRedeem.value;
    },
    insuranceIsMobileAboutOvn() {
      return this.$store.state.insuranceTokenData.isMobileAboutOvn.value;
    },
  },
  methods: {
    changeTab(id: number) {
      this.activeTab = id;
    },
    async fetchDataForOVN(networkName: string) {
      this.loadedDataDashboard = false;
      try {
        await Promise.all([
          this.$store.dispatch('ovnTokenData/fetchOVNTokenData', { networkName }),
        ]);
        this.loadedDataDashboard = true;
      } catch (error) {
        this.loadedDataDashboard = false;
        console.error('Error fetching data:', error);
      }
    },
  },
  watch: {
    '$store.state.network.ovnNetwork': {
      immediate: true,
      handler: function handleNetworkNameChange(newVal, oldVal) {
        if (newVal !== oldVal) {
          console.log('changed ovn network');
          this.fetchDataForOVN(this.$store.state.network.ovnNetwork);
        }
      },
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
  .insurance {
    border-top: 0;
    border-bottom: 0;
    border-radius: 0 0 30px 30px;
  }
}

@media (max-width: 1023px) {
  .insurance,
  .insurance__payouts,
  .insurance__payout-inner {
    width: 100%;
  }
  .insurance-wrapper {
    height: auto;
  }
  .insurance {
    padding: 16px 20px;
    border: 1px solid var(--color-1);
    border-top: 0;
    border-bottom: 0;
    border-radius: 0 0 30px 30px;
  }
  .dashboard-usd-plus-wrap {
    padding: 16px 20px;
    padding-top: 0;
  }
  .insurance__payout-inner {
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 0;
    margin-top: 20px;
    order: 2;
  }
  .insurance__graphics {
    padding: 0;
    margin-top: 14px;
    border: none;
  }
  .tabs-header,
  .insurance-tabs {
    width: 100%;
  }
  .insurance-usd-plus-wrap {
    display: flex;
    flex-direction: column;
  }
}

</style>

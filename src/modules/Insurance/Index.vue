<template>
  <div
    v-if="firstLoad"
    class="insurance__loader"
  >
    <Spinner />
  </div>

  <div
    v-else-if="device.isDesktop"
    class="page-wrapper"
  >
    <Sidebar
      sidebar-contents="ovn"
    />
    <div>
      <div
        class="insurance-wrapper"
      >
        <div
          class="insurance"
        >
          <TokenDataInsurance
            :token-data="tokenData"
            class="insurance__token-data"
          />
          <GraphicsInsurance
            v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem
              && !insuranceIsMobileOvnDashboard"
            :payout-data="payoutData"
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
  </div>
  <div
    v-else-if="!device.isDesktop"
    class="insurance-wrapper"
  >
    <TabsComponent
      :tabs="tabsData"
      :active-tab="activeTab"
      class="insurance-tabs"
      @tab-change="changeTab"
    >
      <div
        v-if="activeTab === 0"
        class="insurance"
      >
        <TokenDataInsurance
          :token-data="tokenData"
          class="insurance__token-data"
        />
        <GraphicsInsurance
          v-if="!insuranceIsMobileAboutOvn && !insuranceIsMobileMintRedeem
            && !insuranceIsMobileOvnDashboard"
          :payout-data="payoutData"
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
          && !insuranceIsMobileOvnDashboard && activeTab === 0"
        class="insurance__payouts"
      >
        <InsurancePayouts
          :payout-data="reversedPayoutData"
          class="insurance__payout-inner"
        />
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
import Sidebar from '@/components/Layout/Sidebar/Index.vue';

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
    Sidebar,
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
    insuranceIsMobileOvnDashboard() {
      return this.$store.state.insuranceTokenData.isMobileOvnDashboard.value;
    },
  },
  watch: {
    '$store.state.network.ovnNetwork': {
      immediate: true,
      handler: function handleNetworkNameChange(newVal, oldVal) {
        if (newVal !== oldVal) {
          // this.fetchDataForOVN(this.$store.state.network.ovnNetwork);
        }
      },
    },
  },
  methods: {
    changeTab(id: number) {
      this.activeTab = id;
    },
    // async fetchDataForOVN(networkName: string) {
    //   this.loadedDataDashboard = false;
    //   try {
    //     await Promise.all([
    //       this.$store.dispatch('ovnTokenData/fetchOVNTokenData', { networkName }),
    //     ]);
    //     this.loadedDataDashboard = true;
    //   } catch (error) {
    //     this.loadedDataDashboard = false;
    //     console.error('Error fetching data:', error);
    //   }
    // },
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
  padding-top: 40px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 20px;
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-17);
    border-color: var(--color-2);
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
  // margin-bottom: 50px;
  width: 100%;
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, .4);
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

@media (max-width: 1024px) {
  .insurance,
  .insurance__payout-inner {
    width: 100%;
  }

  .insurance-wrapper {
    overflow: visible;
    margin-bottom: 70px;
    position: relative;
  }

  .insurance {
    padding: 16px 20px;
    border: 2px solid var(--color-1);
    border-top: 0;
    border-radius: 0 0 30px 30px;
    position: relative;
    z-index: 2;
  }

  .insurance__payouts {
    margin-top: -10px;
    border-radius: 0px 0px 30px 30px;
    padding-bottom: 10px;
    position: relative;
    z-index: 1;
    background: var(--color-8);
    [data-theme="dark"] & {
      background-color: var(--color-6);
      color: var(--color-4);
    }
  }

  .insurance__payout-inner {
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 0;
  }
}

.page-wrapper {
  display: flex;
  gap: 50px;
}

.page-wrapper {
  display: flex;
  gap: 50px;
}

</style>

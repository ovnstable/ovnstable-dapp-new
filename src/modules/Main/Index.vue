<template>
  <div class="swap-module">
    <div
      v-if="!deviceSize.isMobile"
      class="swap-module__form"
    >
      <TabsComponent
        :key="activeTab"
        :tabs="tabsData"
        :active-tab="activeTab"
        @tab-change="changeTab"
      >
        <SwapForm
          v-if="activeTab === 0"
          view-type="SWAP"
          @update-path-view="updatePathView"
          @update-is-loading-data="updateIsLoadingData"
          @update-stablecoins-list="updateStablecoinsList"
        />
        <div
          v-if="activeTab === 1"
          class="form-wrap"
        >
          <div
            v-if="balancesEmpty"
            class="swap-form__loader"
          >
            <Spinner />
          </div>

          <MintRedeemForm
            v-else
            :balance-list="balanceList"
          />
        </div>
        <div
          v-if="activeTab === 2"
          class="form-wrap"
        >
          <BridgeComponent />
        </div>
      </TabsComponent>
    </div>

    <div
      v-else
      class="swap-module__mob-nav"
    >
      <UserBalances v-if="deviceSize.isMobile && walletConnected && account" />
      <div class="swap-module__mob-nav-links">
        <div
          class="swap-module__col"
          @click="showMobileSwap = !showMobileSwap"
          @keypress="showMobileSwap = !showMobileSwap"
        >
          <BaseIcon name="swapMob" />
          <span>Swap</span>
        </div>
        <div
          class="swap-module__col"
          @click="showMobileMintRedeem = !showMobileMintRedeem"
          @keypress="showMobileMintRedeem = !showMobileMintRedeem"
        >
          <BaseIcon name="mintredeemMob" />
          <span>Mint/Redeem</span>
        </div>
        <div
          class="swap-module__col"
          @click="showMobileBridge = !showMobileBridge"
          @keypress="showMobileBridge = !showMobileBridge"
        >
          <BaseIcon name="bridgeMob" />
          <span>Bridge</span>
        </div>
      </div>
    </div>

    <SliderComponent
      v-if="isFirstInitializationForPath || !pathViz"
    />
    <PathView
      v-else
      :path-object="pathViz"
      :input-tokens="inputTokens"
      :output-tokens="outputTokens"
      :is-loading-data="isLoadingData"
    />

    <SwapMobile
      :is-show="showMobileSwap"
      @close="showMobileSwap = !showMobileSwap"
    />
    <MobileMintRedeemMenu
      :is-show="showMobileMintRedeem"
      @close="showMobileMintRedeem = !showMobileMintRedeem"
    />
    <BridgeMobile
      :is-show="showMobileBridge"
      @close="showMobileBridge = !showMobileBridge"
    />
  </div>
</template>

<script lang="ts">
import { mapState, mapGetters } from 'vuex';
import MintRedeemForm from '@/modules/Main/components/MintRedeem/Index.vue';
import SliderComponent from '@/modules/Main/components/Slider/Index.vue';
import TabsComponent from '@/components/Tabs/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import SwapForm from '@/modules/Main/components/Odos/Index.vue';
import BridgeComponent from '@/modules/Main/components/Bridge/Index.vue';
import PathView from '@/modules/Main/components/PathView/Index.vue';
import SwapMobile from '@/modules/Main/components/MobileModals/Swap.vue';
import MobileMintRedeemMenu from '@/modules/Main/components/MobileModals/MintRedeem.vue';
import BridgeMobile from '@/modules/Main/components/MobileModals/BridgeMobile.vue';
import UserBalances from '@/components/Layout/Header/UserBalances.vue';
import { useEventBus } from '@vueuse/core';
import { deviceType } from '@/utils/deviceType.ts';
import { defineComponent } from 'vue';
import { isEmpty } from 'lodash';
import { useTokensQuery } from '@/hooks/fetch/useTokensQuery.ts';
import Spinner from '@/components/Spinner/Index.vue';

export default defineComponent({
  name: 'MainModule',
  components: {
    SliderComponent,
    Spinner,
    TabsComponent,
    MintRedeemForm,
    BaseIcon,
    BridgeComponent,
    SwapForm,
    SwapMobile,
    PathView,
    MobileMintRedeemMenu,
    BridgeMobile,
    UserBalances,
  },
  setup: () => {
    const {
      data: balanceList,
    } = useTokensQuery();

    return {
      balanceList,
    };
  },
  data() {
    return {
      tabsData: [
        {
          id: 0,
          name: 'SWAP',
        },
        {
          id: 1,
          name: 'MINT/REDEEM',
        },
        {
          id: 2,
          name: 'BRIDGE',
        },
      ],
      activeTab: 0,
      pathViz: null as any,
      isLoadingData: true,
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      stablecoinTokens: [],
      isFirstInitializationForPath: true,
      showMobileSwap: false,
      showMobileMintRedeem: false,
      showMobileBridge: false,
    };
  },
  computed: {
    ...mapGetters('network', ['networkName']),
    ...mapGetters('accountData', ['account']),
    ...mapGetters('walletAction', ['walletConnected']),
    ...mapState('odosData', ['availableNetworksList']),
    deviceSize() {
      return deviceType();
    },
    balancesEmpty() {
      return isEmpty(this.balanceList);
    },
  },
  watch: {
    networkName: {
      handler(val) {
        const isAvail = this.availableNetworksList.includes(val);

        if (!isAvail) this.changeTab(1);
      },
      immediate: true,
    },
  },
  mounted() {
    const onTabChange = useEventBus<number>('change-tab-request');
    onTabChange.on((tabIndex) => {
      this.activeTab = tabIndex;
    });
  },
  methods: {
    changeTab(id: number) {
      this.activeTab = id;
    },
    updatePathView(data: any) {
      this.pathViz = data.path;
      this.inputTokens = data.input;
      this.outputTokens = data.output;
      this.isFirstInitializationForPath = false;
    },
    updateIsLoadingData(value: any) {
      this.isLoadingData = value;
    },
    updateStablecoinsList(stablecoinTokens: any) {
      this.stablecoinTokens = stablecoinTokens;
    },
  },
});
</script>

<style lang="scss">
.swap-module {
  display: flex;
  width: 100%;
  gap: 20px;
  height: fit-content;
  overflow: hidden;
  background-color: var(--color-8);
  border-radius: 30px;
  [data-theme="dark"] & {
    background-color: var(--color-19);
  }
  @media (max-width: 1024px) {
    width: 100%;
  }
  @media (max-width: 768px) {
    flex-wrap: wrap;
    background-color: transparent;
    border-radius: 0;
    [data-theme="dark"] & {
      background: none;
    }
  }

  @media (max-width: 640px) {
    margin-bottom: 30px;
  }
}
.swap-module__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;

  @media (max-width: 1200px) {
    width: 70%;
  }
  @media (max-width: 1024px) {
    width: 70%;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}
.form-wrap {
  height: 100%;
  min-height: 530px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-4);
  border: 2px solid var(--color-1);
  border-top: 0;
  padding: 24px 20px;
  border-radius: 0 0 30px 30px;
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-2);
  }
}

.swap-module__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 33%;
  gap: 10px;
  padding: 6px;
  border-radius: 4px;

  svg {
    width: 27px;
    height: 27px;
  }

  cursor: pointer;
  transition: background-color .2s ease;

  &:hover {
    background-color: var(--color-6);
  }
  [data-theme="dark"] & {
    color: var(--color-18);
    svg {
      fill: var(--color-4);
      // stroke: var(--color-4);
    }
  }
}

.swap-module__mob-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.swap-module__mob-nav-links {
  margin-top: 24px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
</style>

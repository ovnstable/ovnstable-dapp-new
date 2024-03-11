<template>
  <div class="swap-module">
    <div class="swap-module__form">
      <TabsComponent
        :tabs="tabsData"
        :active-tab="activeTab"
        :key="activeTab"
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
          <MintRedeemForm />
        </div>
        <div
          v-if="activeTab === 2"
          class="form-wrap"
        >
          <BridgeComponent />
        </div>
      </TabsComponent>
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
  </div>
</template>

<script lang="ts">
import { mapActions, mapState, mapGetters } from 'vuex';
import MintRedeemForm from '@/modules/Main/components/MintRedeem/Index.vue';
import SliderComponent from '@/modules/Main/components/Slider/Index.vue';
import TabsComponent from '@/components/Tabs/Index.vue';
import SwapForm from '@/modules/Main/components/Odos/Index.vue';
import BridgeComponent from '@/modules/Main/components/Bridge/Index.vue';
import PathView from '@/modules/Main/components/PathView/Index.vue';
import { useEventBus } from '@vueuse/core';

export default {
  name: 'MainModule',
  components: {
    SliderComponent,
    TabsComponent,
    MintRedeemForm,
    BridgeComponent,
    SwapForm,
    PathView,
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
      buttonDisabled: true,
      isLoadingData: true,
      inputTokens: [] as any[],
      outputTokens: [] as any[],
      stablecoinTokens: [],
      isFirstInitializationForPath: true,
    };
  },
  mounted() {
    const onTabChange = useEventBus<number>('change-tab-request');
    onTabChange.on((tabIndex) => {
      this.activeTab = tabIndex;
    });
  },
  watch: {
    networkName: {
      handler(val) {
        const isAvail = this.availableNetworksList.includes(val);
        console.log(isAvail, '---isAvailableOnNetwork');

        if (!isAvail) this.changeTab(1);
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters('network', ['networkName']),
    ...mapState('odosData', ['availableNetworksList']),
  },
  methods: {
    ...mapActions('swapModal', ['showSwapModal', 'showMintView']),

    changeTab(id: number) {
      this.activeTab = id;
    },
    mintAction() {
      this.showMintView();
      this.showSwapModal();
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
};
</script>

<style>
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
}
.swap-module__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
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
</style>

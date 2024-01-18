<template>
  <div class="swap-module">
    <div class="swap-module__form">
      <TabsComponent
        :tabs="tabsData"
        @tab-change="changeTab"
      >
        <SwapForm
          v-if="activeTab === 0"
          view-type="SWAP"
          :update-path-view-func="updatePathView"
          :update-button-disabled-func="updateButtonDisabled"
          :update-is-loading-data-func="updateIsLoadingData"
          :update-stablecoins-list-func="updateStablecoinsList"
        />
        <div
          v-if="activeTab === 1"
          class="bridge-wrap"
        >MINT/REDEEM</div>
        <div
          v-if="activeTab === 2"
          class="bridge-wrap"
        >Bridge</div>
      </TabsComponent>

    </div>
    <SliderComponent />
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import SliderComponent from '@/modules/main/components/Slider/Index.vue';
import TabsComponent from '@/components/Tabs/Index.vue';
import SwapForm from '@/modules/main/components/odos/Index.vue';

export default {
  name: 'MainModule',
  components: {
    SliderComponent,
    TabsComponent,
    SwapForm,
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
      pathViz: null,
      buttonDisabled: true,
      isLoadingData: true,
      stablecoinTokens: [],
    };
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
    updatePathView(path: any) {
      this.pathViz = path;
    },
    updateButtonDisabled(value: any) {
      this.buttonDisabled = value;
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
  height: fit-content;
  overflow: hidden;
  background-color: var(--color-8);
  border-radius: 30px;
  [data-theme="dark"] & {
      color: var(--color-2);
  }
}
.swap-module__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
}
.bridge-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% + 3px);
  border: 2px solid var(--color-1);
  border-top: 0;
  padding: 100px 50px;
  border-radius: 0 0 30px 30px;
}
</style>

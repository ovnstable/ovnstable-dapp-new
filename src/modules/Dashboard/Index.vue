<template>
  <!-- <div
    v-if="firstLoad"
    class="insurance__loader"
  >
    <Spinner />
  </div> -->
  <div
    class="dashboard-wrapper"
  >
    <div
      class="dashboard"
    >
      <TabsComponent
        :tabs="tabsData"
        :active-tab="activeTab"
        @tab-change="changeTab"
      >
        <div
          v-if="activeTab === 0"
          class="dashboard-usd-plus-wrap"
        >
          <intervalChain />
          <p>token data for usd+</p>
          <p class="dashboard__graphics"> dashboard graphic</p>
          <p class="dashboard__premiums"> dashboard pools</p>
        </div>
        <div
          v-if="activeTab === 1"
          class="dashboard-tokens-plus-wrap"
        >
          <p>token data for tokens_plus</p>
          <p class="dashboard__graphics"> dashboard graphic</p>
          <p class="dashboard__premiums"> dashboard pools</p>
        </div>
      </TabsComponent>
    </div>
    <div class="dashboard__payouts">
      <p class="dashboard__payout-inner"> dashboard payouts</p>
    </div>
  </div>

</template>

<script lang="ts">

import TabsComponent from '@/components/Tabs/Index.vue';
import intervalChain from '@/modules/Dashboard/intervalChain.vue';

export default {
  name: 'DashboardPage',
  components: {
    TabsComponent,
    intervalChain,
  },
  data() {
    return {
      tabsData: [
        {
          id: 0,
          name: 'USD+',
        },
        {
          id: 1,
          name: 'ALL TOKENS+',
        },
      ],
      activeTab: 0,
    };
  },
  methods: {
    changeTab(id: number) {
      this.activeTab = id;
    },
  },
};

</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  border: 1px solid var(--color-1);
  background: var(--color-4);
  box-shadow: 0px 1px 0px 0px var(--color-1);
  border-top: none;
  width: calc(100% - 40px);
  [data-theme="dark"] & {
    background: var(--color-6);
    border-color: var(--color-2);
    box-shadow: 0px 1px 0px 0px var(--color-2);
  }
}
.dashboard-usd-plus-wrap,
.dashboard-tokens-plus-wrap {
  padding-top: 40px;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 20px;
}
.insurance__token-data,
.dashboard__graphics,
.dashboard__premiums,
.dashboard__payout-inner {
  width: 100%;
}
.dashboard__graphics{
  margin-top: 24px;
  padding: 18px 24px;
  border-radius: 5px;
  border: 1px solid var(--color-1);
}
.dashboard__premiums {
  margin-top: 20px;
}
.dashboard-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  width: calc(100% - 40px);
  min-height: 1500px;
  z-index: 1;
}

.dashboard__payouts {
  width: calc(100% - 40px);
  background: var(--color-8);
  z-index: -1;
  margin-top: -10px;
  border-radius: 0px 0px 30px 30px;
  [data-theme="dark"] & {
    background-color: var(--color-6);
    color: var(--color-4);
  }
}

.dashboard__payout-inner {
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

.dashboard-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px; // Adjust as needed
}

button {
  background-color: transparent;
  border: none;
  font-size: 17px; // Adjust as needed
  font-weight: 600;
  margin-right: 10px; // Adjust as needed
  cursor: pointer;
  transition: color 0.3s;
  &.active {
    color: var(--color-1); // Active tab color
    text-decoration: underline;
  }
  &:hover {
    color: var(--color-1); // Hover color
  }
}

</style>

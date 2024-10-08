<template>
  <div
    v-if="firstLoad"
    class="dashboard__loader"
  >
    <Spinner />
  </div>
  <div
    v-else
    class="dashboard-wrapper"
  >
    <div
      class="dashboard"
    >
      <TabsComponent
        :tabs="tabsData"
        :active-tab="activeTab"
        class="dashboard-tabs"
        @tab-change="changeTab"
      >
        <div
          v-if="activeTab === 0"
          class="dashboard-usd-plus-wrap"
        >
          <IntervalChain />
          <div class="dashboard_token_data_graphics">
            <TokenDataDashboard
              class="dashboard__token-data"
              :portfolio-balance-data="portfolioBalanceData.dataUSDPlus"
            />
            <DashboardGraphic
              :portfolio-balance-data="portfolioBalanceData.dataUSDPlus"
              :only-u-s-d="true"
              :loaded="loaded"
              :portfolio-prices="portfolioBalanceData.prices"
              class="dashboard__graphics"
            />
          </div>
          <p
            v-if="portfolioBalanceData.dataUSDPlus.length > 0"
            class="dashboard-tokens-transactions"
          >
            USD+ TRANSACTIONS
          </p>
        </div>
        <div
          v-if="activeTab === 1"
          class="dashboard-tokens-plus-wrap"
        >
          <IntervalChain />
          <div class="dashboard_token_data_graphics">
            <TokensPlusDashboard
              class="dashboard__token-data"
              :portfolio-balance-data="portfolioBalanceData"
              :portfolio-balance-data-full="combinedPortfolioData"
            />
            <DashboardGraphic
              :portfolio-balance-data="combinedPortfolioData"
              :only-u-s-d="false"
              :loaded="loaded"
              :portfolio-prices="portfolioBalanceData.prices"
              class="dashboard__graphics"
            />
          </div>

          <p
            v-if="combinedPortfolioData.length > 0"
            class="dashboard-tokens-transactions"
          >
            TOKENS+ TRANSACTIONS
          </p>
        </div>
      </TabsComponent>
    </div>
    <div class="dashboard__payouts">
      <DashboardTransactions
        v-if="portfolioDataForDashboardTransactions.length > 0"
        :portfolio-balance-data="portfolioDataForDashboardTransactions"
        class="dashboard__payout-inner"
      />
    </div>
  </div>
</template>

<script lang="ts">

import TabsComponent from '@/components/Tabs/Index.vue';
import IntervalChain from '@/modules/Dashboard/IntervalChain.vue';
import TokenDataDashboard from '@/modules/Dashboard/TokenDataDashboard.vue';
import Spinner from '@/components/Spinner/Index.vue';
import DashboardGraphic from '@/modules/Dashboard/DashboardGraphic.vue';
import DashboardTransactions from '@/modules/Dashboard/DashboardTransactions.vue';
import TokensPlusDashboard from '@/modules/Dashboard/TokensPlusDashboard.vue';

export default {
  name: 'DashboardPage',
  components: {
    TabsComponent,
    IntervalChain,
    TokenDataDashboard,
    DashboardGraphic,
    TokensPlusDashboard,
    DashboardTransactions,
    Spinner,
  },
  props: {
    portfolioBalanceData: {
      type: Object,
      default: () => ({}),
    },
    loaded: {
      type: Boolean,
      default: false,
    },
    firstLoad: {
      type: Boolean,
      required: true,
    },
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
  computed: {
    portfolioDataForDashboardTransactions() {
      if (this.activeTab === 1) {
        return this.combinedPortfolioData;
      } return this.portfolioBalanceData.dataUSDPlus;
    },
    combinedPortfolioData() {
      const convertedEthTransactions = this.portfolioBalanceData.dataETHPlus.map((trx: any) => ({
        ...trx,
        opening_balance: trx.opening_balance * this.portfolioBalanceData.prices.ethPlus,
        change_balance: trx.change_balance * this.portfolioBalanceData.prices.ethPlus,
        closing_balance: trx.closing_balance * this.portfolioBalanceData.prices.ethPlus,
      }));
      const convertedUsdTransactions = this.portfolioBalanceData.dataUSDPlus.map((trx: any) => ({
        ...trx,
        opening_balance: trx.opening_balance * this.portfolioBalanceData.prices.usdPlus,
        change_balance: trx.change_balance * this.portfolioBalanceData.prices.usdPlus,
        closing_balance: trx.closing_balance * this.portfolioBalanceData.prices.usdPlus,
      }));
      const convertedUsdtTransactions = this.portfolioBalanceData.dataUSDTPlus.map((trx: any) => ({
        ...trx,
        opening_balance: trx.opening_balance * this.portfolioBalanceData.prices.usdtPlus,
        change_balance: trx.change_balance * this.portfolioBalanceData.prices.usdtPlus,
        closing_balance: trx.closing_balance * this.portfolioBalanceData.prices.usdtPlus,
      }));
      const convertedDaiTransactions = this.portfolioBalanceData.dataDAIPlus.map((trx: any) => ({
        ...trx,
        opening_balance: trx.opening_balance * this.portfolioBalanceData.prices.daiPlus,
        change_balance: trx.change_balance * this.portfolioBalanceData.prices.daiPlus,
        closing_balance: trx.closing_balance * this.portfolioBalanceData.prices.daiPlus,
      }));
      const convertedUsdcTransactions = this.portfolioBalanceData.dataUSDCPlus.map((trx: any) => ({
        ...trx,
        opening_balance: trx.opening_balance * this.portfolioBalanceData.prices.usdcPlus,
        change_balance: trx.change_balance * this.portfolioBalanceData.prices.usdcPlus,
        closing_balance: trx.closing_balance * this.portfolioBalanceData.prices.usdcPlus,
      }));

      return [
        ...convertedUsdTransactions,
        ...convertedEthTransactions,
        ...convertedUsdtTransactions,
        ...convertedDaiTransactions,
        ...convertedUsdcTransactions,
      ];
    },
  },
  watch: {
    activeTab: {
      immediate: true,
      handler() {
        this.$store.dispatch('intervalDashboard/setInterval', 'DAY');
      },
    },
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
  border-radius: 30px;
  background: var(--color-4);
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-6);
    border-color: var(--color-2);
  }
}
.dashboard-usd-plus-wrap,
.dashboard-tokens-plus-wrap {
  padding-top: 40px;
  border: 2px solid var(--color-1);
  border-top: none;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 20px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  [data-theme="dark"] & {
    background: var(--color-17);
  }
}

.dashboard__token-data,
.dashboard__graphics,
.dashboard__premiums,
.dashboard__payout-inner {
  width: 100%;
}

.dashboard__token-data,
.dashboard__graphics {
  [data-theme="dark"] & {
    background: var(--color-17);
  }
}

.dashboard-tokens-transactions {
  margin-top: 25px;
  color: var(--color-1);
  font-size: 17px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.dashboard__graphics{
  border-radius: 5px;
}
.dashboard_token_data_graphics {
  margin-top: 25px;
  margin-bottom: 25px;
  padding: 20px 25px;
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
  width: 100%;
  z-index: 1;
  margin-top: 24px;
}

.dashboard__payouts {
  width: 100%;
  background: var(--color-8);
  z-index: -1;
  margin-top: -20px;
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

.dashboard__loader {
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
}

.dashboard-tabs {
  width: calc(100% - 3px);
}

button {
  background-color: transparent;
  border: none;
  font-size: 17px;
  font-weight: 600;
  margin-right: 10px;
  cursor: pointer;
  transition: color 0.3s;
  &.active {
    color: var(--color-1);
    text-decoration: underline;
  }
  &:hover {
    color: var(--color-1);
  }
}

@media (max-width: 640px) {
  .dashboard-usd-plus-wrap {
    padding: 30px 20px;
    border: none;
  }
  .dashboard_token_data_graphics {
    border: none;
    padding: 0;
  }
  .dashboard-tokens-transactions {
    margin-top: 22px;
    font-size: 16px;
  }
}

</style>

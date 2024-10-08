<template>
  <div class="dashboard__token-data">
    <div class="dashboard__token-data-from">
      <BaseIcon
        name="USD+_money_markets"
        class="dashboard__token-data-main-token"
      />
      <p
        v-if="device.isMobile"
        class="dashboard__token-data-title--token-mobile"
      > USD+ </p>
      <div class="dashboard__token-data-link-title">
        <p
          v-if="!device.isMobile"
          class="dashboard__token-data-title--token"
        > USD+ </p>
        <p class="dashboard__token-data-title-period">{{ getFormattedPeriod }}</p>
      </div>
    </div>

    <div class="dashboard__divider" />
    <div class="dashboard__payout-data">
      <p class="dashboard__token-data-title">Risk factor</p>
      <div class="dashboard__token-data-risk">
        <p>Low</p>
        <BaseIcon
          name="DashboardRiskFactorLow"
        />
      </div>
    </div>
    <div class="dashboard__divider" />
    <div class="dashboard__apy-data">
      <p class="dashboard__token-data-title">Balance</p>
      <div class="dashboard__apy-data-chain">
        <p class="dashboard__token-data-num"> {{ getBalance }}</p>
        <p
          v-if="!device.isMobile"
          :class="['dashboard__token-data-growth-balance', { 'negative-growth': isGrowthNegative }]"
        >
          {{ growthPercentage() }}
        </p>

      </div>
    </div>
    <div class="dashboard__divider" />
    <div class="dashboard__tvl-data">
      <p class="dashboard__token-data-title"> Profit</p>
      <p class="dashboard__token-data-h">{{calculateProfit()}}</p>
      <p
        v-if="!device.isMobile"
        :class="{ 'negative-growth': isGrowthNegative }"
      >{{ formatInterval() }}</p>
    </div>
    <div class="dashboard__divider dashboard__divider--last-divider" />
  </div>

</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { deviceType } from '@/utils/deviceType.ts';
import { getFormattedPeriodDashboard } from '@/store/helpers/index.ts';

export default {
  name: 'TokenDataDashboard',
  components: {
    BaseIcon,
  },
  props: {
    portfolioBalanceData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    device() {
      return deviceType();
    },
    networkName() {
      return this.$store.state.network.dashboardNetwork;
    },
    currentIntervalDashboard() {
      return this.$store.state.intervalDashboard.intervalDashboard;
    },
    getDashboardInterval() {
      return this.$store.state.intervalDashboard.intervalDashboard;
    },
    isGrowthNegative() {
      const growth = this.growthPercentage();
      if (growth === 0) {
        return false;
      }
      return growth.startsWith('-');
    },
    getFormattedPeriod() {
      return getFormattedPeriodDashboard(this.getDashboardInterval, this.portfolioBalanceData);
    },
    getBalance() {
      if (this.portfolioBalanceData.length === undefined) {
        return '$0,00';
      }
      const payoutTransactions = this.portfolioBalanceData.filter((transaction: any) => transaction.type === 'PAYOUT' || transaction.type === 'payout');
      if (payoutTransactions.length > 0) {
        const balance = payoutTransactions[0].closing_balance;
        return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(balance);
      }
      return '$0,00';
    },
  },
  methods: {
    growthPercentage(): any {
      if (this.portfolioBalanceData.length === undefined) {
        return '0.0000%';
      }
      const interval = this.currentIntervalDashboard.toLowerCase();
      const payoutTransactions = this.portfolioBalanceData
        .filter((transaction: any) => transaction.type === 'PAYOUT');
      let numberOfDays;
      switch (interval) {
        case 'day':
          numberOfDays = 1;
          break;
        case 'week':
          numberOfDays = 7;
          break;
        case 'month':
          numberOfDays = 30;
          break;
        case 'all time':
          numberOfDays = payoutTransactions.length;
          break;
        default:
          numberOfDays = 1;
      }
      const initialTransaction = payoutTransactions[numberOfDays - 1];
      const totalProfit = this.calculateProfit();
      const normalizedString = totalProfit.replace(' $', '').replace(',', '.');
      const numberProfit = parseFloat(normalizedString);
      if (initialTransaction) {
        const initialBalance = initialTransaction.opening_balance;
        if (initialBalance === 0) {
          return '0.0000%';
        }
        const growth = ((initialBalance + numberProfit) / initialBalance - 1) * 100;
        if (Number.isNaN(growth)) {
          return '0.00%';
        }
        const formattedGrowth = growth.toFixed(4);
        return `${growth > 0 ? `+${formattedGrowth}` : formattedGrowth}%`;
      }
      return '0.0000%';
    },
    calculateProfit(): string {
      if (!Array.isArray(this.portfolioBalanceData) || this.portfolioBalanceData.length === 0) {
        return '$0,0000';
      }

      const interval = this.currentIntervalDashboard.toLowerCase();
      const payoutTransactions = this.portfolioBalanceData
        .filter((transaction: any) => transaction.type === 'PAYOUT');
      let numberOfDays;

      switch (interval) {
        case 'day':
          numberOfDays = 1;
          break;
        case 'week':
          numberOfDays = 7;
          break;
        case 'month':
          numberOfDays = 30;
          break;
        case 'all time':
          numberOfDays = payoutTransactions.length;
          break;
        default:
          numberOfDays = 1;
      }

      const today = new Date();
      const endDate = new Date(today.getFullYear(), today.getMonth(), today
        .getDate() - numberOfDays);

      const totalProfit = payoutTransactions
        .filter((transaction: any) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate > endDate;
        })
        .reduce((acc: number, curr: any) => acc + curr.change_balance, 0);

      return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
      }).format(totalProfit);
    },

    formatInterval() {
      let text;
      switch (this.currentIntervalDashboard.toLowerCase()) {
        case 'day':
          text = 'per day';
          break;
        case 'week':
          text = 'per week';
          break;
        case 'month':
          text = 'per month';
          break;
        case 'all time':
          text = 'all time';
          break;
        default:
          text = 'Per day';
      }
      return text;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard__token-data {
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  background: var(--color-4);
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-6);
  }
}
.dashboard__token-data-title-period {
  margin-top: 10px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.dashboard__token-data-growth-balance {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 500;
  color: var(--color-12);
}
.negative-growth {
  color: var(--color-9) !important;
}
.dashboard__token-data-risk {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  p {
    color: var(--color-1);
    font-size: 20px;
    font-weight: 500;
    margin-right: 10px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.dashboard__token-data-from {
  display: flex;
  flex-direction: row;
}
.dashboard__token-data-link-title {
  display:flex;
  flex-direction: column;
  margin-left: 20px;
}
.dashboard__token-data-title {
  text-align: left;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.dashboard__token-data-title--token {
  color: var(--color-1);
  font-size: 22px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.dashboard__token-data-link-addr {
  margin-top: 10px;
  min-width: 79px;
  color: var(--color-2);
  font-size: 12px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.dashboard__divider {
  margin-left: 30px;
  margin-right: 30px;
  border: 1px solid var(--color-7);
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.dashboard__divider--last-divider {
  margin-right: 0;
}

.dashboard__payout-data,
.dashboard__apy-data,
.dashboard__tvl-data {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dashboard__token-data-num,
.dashboard__token-data-col-token {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 500;
}
.dashboard__tvl-data :nth-child(3) {
  font-size: 20px;
  font-weight: 500;
  color: var(--color-12);
}
.dashboard__token-data-num {
  text-align: center;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.dashboard__token-data-num--apy-num {
  margin-top: 0px;
}
.dashboard__apy-data-chain {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dashboard__token-data-h {
  margin-top: 20px;
  margin-bottom: 4px;
  color: var(--color-1);
  font-size: 20px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.selected {
  background: var(--color-4);
  [data-theme="dark"] & {
    background: var(--color-2);
  }
}

.dashboard__token-data-main-token {
  min-width: 70px;
  [data-theme="dark"] & {
    border: 1px solid var(--color-4);
    border-radius: 50%;
  }
}

@media (max-width: 1024px) {
  .dashboard__token-data-main-token {
    scale: 65%;
  }
  .dashboard__token-data-col-token {
    margin-left: 2px;
  }
  .dashboard__token-data-link-title {
    margin-left: 5px;
  }

  .dashboard__token-data-title {
      font-size: 16px;
  }
  .dashboard__token-data-num {
    font-size: 14px;
  }
  .dashboard__token-data-h {
    font-size: 12px;
  }
  .dashboard__divider {
    margin-left: 5px;
    margin-right: 5px;
  }
}

@media (max-width: 768px) {
  .dashboard__divider {
    margin-left: 20px;
    margin-right: 20px;
  }
  .dashboard__token-data-col-token {
    margin: 0;
  }
  .dashboard__token-data-link-addr {
    margin-top: 40px;
  }
  .dashboard__token-data-num--payout-ago {
    margin-right: 15px;
  }
}

@media (max-width: 620px) {
  .dashboard__token-data {
    flex-direction: column;
  }
  .dashboard__payout-data,
  .dashboard__apy-data,
  .dashboard__tvl-data,
  .dashboard__token-data-link-title,
  .dashboard__apy-data-chain {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
  .dashboard__apy-data-chain {
    margin-top: 0;
  }
  .dashboard__token-data-h,
  .dashboard__token-data-num,
  .dashboard__token-data-risk,
  .dashboard__token-data-title-period,
  .dashboard__token-data-link-title {
    margin: 0;
  }
  .dashboard__divider {
    margin-top: 6px;
    margin-bottom: 6px;
    margin-right: 0;
    margin-left: 0;
    width: 100%;
  }
  .dashboard__token-data-growth-balance {
    margin-top: 0;
    margin-left: 6px;
  }
}

@media (max-width: 640px) {
  .dashboard__apy-data-chain {
    margin-top: 0;
  }
  .dashboard__token-data {
    flex-direction: column;
  }
  .dashboard__payout-data,
  .dashboard__apy-data,
  .dashboard__tvl-data,
  .dashboard__token-data-link-title {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
  .dashboard__token-data-h,
  .dashboard__token-data-num,
  .dashboard__token-data-risk,
  .dashboard__token-data-title-period,
  .dashboard__token-data-link-title {
    margin: 0;
  }
  .dashboard__divider {
    margin-top: 6px;
    margin-bottom: 6px;
    margin-right: 0;
    margin-left: 0;
    width: 100%;
  }
  .dashboard__token-data-title--token-mobile {
    display: flex;
    align-items: center;
    margin-right: auto;
    font-size: 16px;
    color: var(--color-1);
    font-weight: 600;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .dashboard__token-data-title-period,
  .dashboard__token-data-title {
    font-size: 12px;
  }

  .dashboard__token-data-h,
  .dashboard__token-data-risk p {
    font-size: 14px;
  }

}

</style>

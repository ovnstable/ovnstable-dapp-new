<template>
  <div class="dashboard__all-tokens-data">
    <div class="dashboard__tokens-data-select">
      <p>SELECT ALL</p>
      <BaseIcon
        name="DashboardETH+Tokens"
      />
      <BaseIcon
        name="DashboardUSD+Tokens"
      />
      <BaseIcon
        name="DashboardUSDT+Tokens"
      />
      <BaseIcon
        name="DashboardDAI+Tokens"
      />
    </div>
    <div class="dasboard__tokens-data-balances-profit">
      <div class="dasboard__tokens-data-tokens-wrapper">
        <div class="dashboard__divider-first" />
        <div class="dasboard__tokens-data-tokens">
          <p class="dasboard__tokens-data-tokens-title">Token</p>
          <div class="dasboard__tokens-data-tokens-icon">
            <BaseIcon
              name="DashboardETH+Tokens"
            />
            <p>ETH+</p>
          </div>
          <div class="dasboard__tokens-data-tokens-icon">
            <BaseIcon
              name="DashboardUSD+Tokens"
            />
            <p>USD+</p>
          </div>
          <div class="dasboard__tokens-data-tokens-icon">
            <BaseIcon
              name="DashboardUSDT+Tokens"
            />
            <p>USDT+</p>
          </div>
          <div class="dasboard__tokens-data-tokens-icon">
            <BaseIcon
              name="DashboardDAI+Tokens"
            />
            <p>DAI+</p>
          </div>
          <p class="dasboard__tokens-data-total-in-tokens">Total</p>
        </div>

      </div>
      <div class="dasboard__tokens-data-balances">
        <p>Token balance</p>
        <p>balance eth</p>
        <p>balance usd</p>
        <p>balance usdt</p>
        <p>balance dai</p>
      </div>
      <div class="dasboard__tokens-data-balances-dollars">
        <p>USD balance</p>
        <p>balance eth usd</p>
        <p>balance usd usd</p>
        <p>balance usdt usd</p>
        <p>balance dai usd</p>
        <p class="dasboard__tokens-data-total">Total balance</p>
      </div>
      <div class="dashboard__divider" />
      <div class="dasboard__tokens-data-profit">
        <p>Profit</p>
        <p>profit eth</p>
        <p>profit usd</p>
        <p>profit usdt</p>
        <p>profit </p>
        <p class="dasboard__tokens-data-total">Total profit</p>
      </div>
      <div class="dashboard__divider-last" />
    </div>

  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'TokensPlusDashboard',
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
    networkName() {
      return this.$store.state.network.dashboardNetwork;
    },
    currentIntervalDashboard() {
      return this.$store.state.intervalDashboard.intervalDashboard;
    },
    isGrowthNegative() {
      const growth = this.growthPercentage();
      if (growth === 0) {
        return false;
      }
      return growth.startsWith('-');
    },
  },
  methods: {
    getBalance() {
      if (this.portfolioBalanceData.length === undefined) {
        return '$0,00';
      }
      const payoutTransactions = this.portfolioBalanceData.filter((transaction: any) => transaction.type === 'PAYOUT');
      if (payoutTransactions.length > 0) {
        const balance = payoutTransactions[0].closing_balance;
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(balance);
      }
      return '$0,00';
    },

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

      return new Intl.NumberFormat('de-DE', {
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
.dashboard__all-tokens-data {
  display: flex;
  flex-direction: column;
}

.dasboard__tokens-data-balances-profit {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dasboard__tokens-data-tokens,
.dasboard__tokens-data-balances,
.dasboard__tokens-data-balances-dollars,
.dasboard__tokens-data-profit {
  display: flex;
  flex-direction: column;
}

.dasboard__tokens-data-balances :nth-child(1),
.dasboard__tokens-data-balances-dollars :nth-child(1),
.dasboard__tokens-data-profit :nth-child(1) {
  margin-bottom: 24px;
}
.dasboard__tokens-data-tokens-wrapper {
  display: flex;
  flex-direction: row;
}

.dasboard__tokens-data-tokens-title {
  margin-bottom: 18px;
  text-align: center;
}
.dasboard__tokens-data-tokens .dasboard__tokens-data-tokens-icon:not(:first-of-type) {
  margin-top: 8px;
}

.dasboard__tokens-data-balances p:nth-of-type(n+3),
.dasboard__tokens-data-balances-dollars p:nth-of-type(n+3),
.dasboard__tokens-data-profit p:nth-of-type(n+3) {
  margin-top: 16px;
}

.dasboard__tokens-data-tokens-icon {
  display: flex;
  flex-direction: row;
   align-items: center;
  p {
    margin-left: 10px;
    display: flex;
    align-items: center;
  }
}
.dasboard__tokens-data-balances-dollars p {
  text-align: right;
}
.dasboard__tokens-data-profit p {
  text-align: center;
}
.dashboard__tokens-data-select {
  display: flex;
  flex-direction: row;
  margin-bottom: 26px;
  p {
    font-size: 9px;
    display: flex;
    max-width: 30px;
    text-align: center;
    margin-right: 6px;
    color: var(--color-3);
  }
   svg:not(:last-child) {
    margin-right: 8px;
  }
}

.dashboard__divider-first {
  margin-right: 20px;
  border: 1px solid var(--color-7);
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}
.dashboard__divider {
  border: 1px solid var(--color-7);
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.dashboard__divider-last {
  margin-left: 30px;
  border: 1px solid var(--color-7);
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.dasboard__tokens-data-total-in-tokens {
  padding-left: 12px;
  text-align: center;
  color: var(--color-1);
  font-weight: 500;
  margin-top: 20px;
}
.dasboard__tokens-data-total {
  margin-top: 22px !important;
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

@media (max-width: 576px) {
  .dashboard__token-data-num {
    margin-top: 60px;
  }
  .dashboard__apy-data-chain {
    margin: 0;
  }
  .dashboard__divider {
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>

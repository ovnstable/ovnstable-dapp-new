<template>
  <div class="dashboard__token-data">
    <div class="dashboard__token-data-from">
      <BaseIcon
        name="DashboardUsdPlus"
        class="dashboard__token-data-main-token"
      />
      <div class="dashboard__token-data-link-title">
        <p class="dashboard__token-data-title--token"> USD+ </p>
        <p class="dashboard__token-data-title-period">{{ formattedPeriod() }}</p>
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
        <p class="dashboard__token-data-num"> {{ getBalance() }}</p>
        <p class="dashboard__token-data-growth-balance">{{growthPercentage() }}</p>
      </div>
    </div>
    <div class="dashboard__divider" />
    <div class="dashboard__tvl-data">
      <p class="dashboard__token-data-title"> Profit</p>
      <p class="dashboard__token-data-h">2.986</p>
    </div>
    <div class="dashboard__divider dashboard__divider--last-divider" />
  </div>

</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

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
    networkName() {
      return this.$store.state.network.dashboardNetwork;
    },
    networkScan() {
      return this.$store.state.network.marketExplorerURL;
    },
    currentIntervalDashboard() {
      return this.$store.state.intervalDashboard.intervalDashboard;
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
        return '0.00%';
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
          numberOfDays = 0;
      }

      const initialTransaction = payoutTransactions[numberOfDays - 1];

      if (initialTransaction) {
        const currentBalance = payoutTransactions[0].closing_balance;
        const initialBalance = initialTransaction.opening_balance;
        const growth = ((currentBalance - initialBalance) / initialBalance) * 100;
        if (Number.isNaN(growth)) {
          return '0.00%';
        }
        const formattedGrowth = growth.toFixed(2);
        return `${growth > 0 ? `+${formattedGrowth}` : formattedGrowth}%`;
      }
      return 0;
    },

    formattedPeriod() {
      const today = new Date();
      let formattedDate = 'N/A';
      switch (this.currentIntervalDashboard.toLowerCase()) {
        case 'day': {
          formattedDate = today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }).replace(',', '').replace(/ /g, ' ');
          break;
        }
        case 'week': {
          const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
          formattedDate = weekAgo.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }).replace(',', '').replace(/ /g, ' ');
          break;
        }
        case 'month': {
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          formattedDate = monthAgo.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }).replace(',', '').replace(/ /g, ' ');
          break;
        }
        case 'all time':
          if (this.portfolioBalanceData && this.portfolioBalanceData.length > 0) {
            const earliestTransaction = this
              .portfolioBalanceData[this.portfolioBalanceData.length - 1];
            const earliestDate = new Date(earliestTransaction.date);
            formattedDate = earliestDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            }).replace(',', '').replace(/ /g, ' ');
          }
          break;
        default: {
          formattedDate = today.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }).replace(',', '').replace(/ /g, ' ');
        }
      }

      const formattedDateParts = formattedDate.split(' ');
      if (formattedDateParts.length === 3) {
        formattedDate = `From ${formattedDateParts[0]} ${formattedDateParts[1]} ‘${formattedDateParts[2]}`;
      }

      return formattedDate || 'From N/A';
    },

    getIconName(chain:string) {
      const selectedChain = this.$store.state.network.marketNetwork;
      const formattedChain = chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();

      if (chain.toLowerCase() !== selectedChain.toLowerCase()) {
        return `Icon${formattedChain}Off`;
      }

      return `Icon${formattedChain}On`;
    },
    formatNetworkIconName(networkName: string) {
      if (!networkName) return '';
      return `Icon${networkName.charAt(0).toUpperCase()}${networkName.slice(1)}On`;
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
}

.dashboard__token-data-growth-balance {
  margin-top: 4px;
  font-size: 20px;
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

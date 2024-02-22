<template>
  <div class="dashboard__all-tokens-data">
    <div class="dashboard__tokens-data-select">
      <p>SELECT ALL</p>
      <div
        v-for="(token, index) in availableTokens"
        :key="index"
        class="dashboard__tokens-data-icon-wrapper"
        @click="toggleTokenSelection(token.name)"
        @keypress="toggleTokenSelection(token.name)"
        :class="{ 'dashboard__tokens-data-token-selected': selectedTokens.includes(token.name) }"
      >
        <BaseIcon :name="token.iconName" />
      </div>
    </div>
    <div class="dasboard__tokens-data-balances-profit">
      <div class="dasboard__tokens-data-tokens-wrapper">
        <div class="dashboard__divider-first" />
        <div class="dasboard__tokens-data-tokens">
          <p class="dasboard__tokens-data-tokens-title">Token</p>
          <div
            v-for="(token, index) in availableTokens
              .filter((token: any) => selectedTokens.includes(token.name))"
            :key="index"
            class="dasboard__tokens-data-tokens-icon"
          >
            <BaseIcon :name="token.iconName" />
            <p>{{ token.name }}</p>
          </div>
          <p class="dasboard__tokens-data-total-in-tokens">Total</p>
        </div>

      </div>
      <div class="dasboard__tokens-data-balances">
        <p>Token balance</p>
        <p
          v-for="token in availableTokensBalancesProfit.filter((token: any) => selectedTokens.includes(token.name + '+'))"
          :key="`balance-${token.name}`"
        >
          {{ getBalance(portfolioBalanceData[`data${token.name}Plus`], token.isETH) }}
        </p>
      </div>
      <div class="dasboard__tokens-data-balances-dollars">
        <p>USD balance</p>
        <p
          v-for="token in availableTokensBalancesProfit.filter((token: any) => selectedTokens.includes(token.name + '+'))"
          :key="`usd-balance-${token.name}`"
        >
          {{ getBalanceUSD(getBalance(portfolioBalanceData[`data${token.name}Plus`], token.isETH), token.name.toLowerCase() + 'Plus') }}
        </p>
        <p class="dasboard__tokens-data-total">{{getTotalBalance()}}</p>
      </div>
      <div class="dashboard__divider" />
      <div class="dasboard__tokens-data-profit">
        <p>Profit</p>
        <p
          v-for="token in availableTokensBalancesProfit.filter((token: any) => selectedTokens.includes(token.name + '+'))"
          :key="`profit-${token.name}`"
        >
          {{ calculateProfit(portfolioBalanceData[`data${token.name}Plus`]) }}
        </p>
        <p class="dasboard__tokens-data-total">{{totalProfit()}}</p>
      </div>
      <div class="dashboard__divider-last" />
    </div>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';

export default {
  name: 'TokensPlusDashboard',
  components: {
    BaseIcon,
  },
  data() {
    return {
      selectedTokens: [],
      tokenDisplayInfo: {
        usdPlus: { name: 'USD+', iconName: 'DashboardUSD+Tokens' },
        daiPlus: { name: 'DAI+', iconName: 'DashboardDAI+Tokens' },
        usdtPlus: { name: 'USDT+', iconName: 'DashboardUSDT+Tokens' },
        ethPlus: { name: 'ETH+', iconName: 'DashboardETH+Tokens' },
      },
    };
  },
  props: {
    portfolioBalanceData: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.selectedTokens = this.availableTokens.map((token: any) => token.name);
  },
  watch: {
    '$store.state.network.dashboardNetwork': {
      immediate: true,
      handler: function handleNetworkNameChange(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.selectedTokens = this.availableTokens.map((token: any) => token.name);
        }
      },
    },
  },
  computed: {
    networkName() {
      return this.$store.state.network.dashboardNetwork;
    },
    currentIntervalDashboard() {
      return this.$store.state.intervalDashboard.intervalDashboard;
    },
    availableTokens(): any {
      const currentChainTokens = chainContractsMap[this.networkName.toLowerCase()];
      if (!currentChainTokens) {
        return [];
      }
      return Object.keys(currentChainTokens)
        .filter((token) => token.endsWith('Plus') && currentChainTokens[token].tokenPlus)
        .map((token) => ({
          ...this.tokenDisplayInfo[token],
          contractAddress: currentChainTokens[token].tokenPlus,
        }))
        .filter((token) => token.name);
    },
    availableTokensBalancesProfit() {
      const currentChain = this.networkName;
      const tokensOnCurrentChain = chainContractsMap[currentChain];
      return Object.entries(tokensOnCurrentChain)
        .filter(([key, value]) => key.endsWith('Plus') && value.tokenPlus)
        .map(([key]) => ({
          name: key.toUpperCase().slice(0, -4),
          iconName: `Dashboard${key.charAt(0).toUpperCase() + key.slice(1)}Tokens`,
          isETH: key === 'ethPlus',
        }));
    },
  },
  methods: {
    toggleTokenSelection(tokenName: any) {
      console.log('token selection was clicked');
      const index = this.selectedTokens.indexOf(tokenName);
      if (index === -1) {
        this.selectedTokens.push(tokenName);
      } else {
        this.selectedTokens.splice(index, 1);
      }
    },
    getBalance(balance: any, isETH: boolean) {
      if (!Array.isArray(balance) || balance.length === 0) {
        return isETH ? '0.000000' : '0.00';
      }
      const balanceNumber = balance[0].closing_balance;
      console.log(`this is balanceNumber ${balanceNumber}`);
      if (isETH) {
        return parseFloat(balanceNumber).toFixed(6);
      } return parseFloat(balanceNumber).toFixed(2);
    },
    getBalanceUSD(balance: any, tokenName: string) {
      console.log('here is get balance usd');
      console.log(tokenName);
      const price = this.portfolioBalanceData.prices[tokenName];
      console.log(this.portfolioBalanceData.prices);
      if (!price) {
        console.error('Price for the given token name is not found.');
        return '$0,0000';
      }

      const valueInUSD = balance * price;

      const formattedValueInUSD = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(valueInUSD);

      return formattedValueInUSD;
    },
    calculateProfit(balance: any) {
      if (!Array.isArray(balance) || balance.length === 0) {
        return '0,0000 $';
      }

      const interval = this.currentIntervalDashboard.toLowerCase();
      const payoutTransactions = balance
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
    totalProfit() {
      let totalProfitUSD = 0;

      totalProfitUSD += parseFloat(this.calculateProfit(this.portfolioBalanceData.dataETHPlus)
        .replace(',', '.').replace(' $', ''));
      totalProfitUSD += parseFloat(this.calculateProfit(this.portfolioBalanceData.dataUSDPlus)
        .replace(',', '.').replace(' $', ''));
      totalProfitUSD += parseFloat(this.calculateProfit(this.portfolioBalanceData.dataUSDTPlus)
        .replace(',', '.').replace(' $', ''));
      totalProfitUSD += parseFloat(this.calculateProfit(this.portfolioBalanceData.dataDAIPlus)
        .replace(',', '.').replace(' $', ''));

      const formattedTotalProfitUSD = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
      }).format(totalProfitUSD);

      return formattedTotalProfitUSD;
    },

    getTotalBalance() {
      let totalBalanceUSD = 0;

      totalBalanceUSD += parseFloat(this.getBalanceUSD(this
        .getBalance(this.portfolioBalanceData.dataETHPlus, true), 'ethPlus').replace('$', '').replace(',', '.'));
      totalBalanceUSD += parseFloat(this.getBalanceUSD(this
        .getBalance(this.portfolioBalanceData.dataUSDPlus, false), 'usdPlus').replace('$', '').replace(',', '.'));
      totalBalanceUSD += parseFloat(this.getBalanceUSD(this
        .getBalance(this.portfolioBalanceData.dataUSDTPlus, false), 'usdtPlus').replace('$', '').replace(',', '.'));
      totalBalanceUSD += parseFloat(this.getBalanceUSD(this
        .getBalance(this.portfolioBalanceData.dataDAIPlus, false), 'daiPlus').replace('$', '').replace(',', '.'));

      const formattedTotalBalanceUSD = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(totalBalanceUSD);

      return formattedTotalBalanceUSD;
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
.dasboard__tokens-data-tokens > *:not(:first-child),
.dasboard__tokens-data-balances > *:not(:first-child),
.dasboard__tokens-data-balances-dollars > *:not(:first-child),
.dasboard__tokens-data-profit > *:not(:first-child) {
  color: var(--color-1);
  font-weight: 500;
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
.dashboard__tokens-data-icon-wrapper {
  cursor: pointer;
}

.dashboard__tokens-data-token-selected {
  border: 2px solid #4CAF50;
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

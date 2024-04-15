<template>
  <div class="dashboard__all-tokens-data">
    <div class="dashboard__tokens-data-select">
      <ButtonComponent
        @click="selectAllTokens"
      >
        SELECT ALL
      </ButtonComponent>
      <div
        v-for="(token, index) in availableTokens"
        :key="index"
        class="dashboard__tokens-data-icon-wrapper"
        @click="toggleTokenSelection(token.name)"
        @keypress="toggleTokenSelection(token.name)"
        :class="{ 'dashboard__tokens-data-token-selected': selectedTokens.includes(token.name) }"
      >
        <BaseIcon :name="token.iconName" />
        <p v-if="device.isMobile">{{ token.name }}</p>
      </div>
    </div>
    <div
      v-if="!device.isMobile"
      class="dasboard__tokens-data-balances-profit"
    >
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
          v-for="token in availableTokensBalancesProfit
            .filter((token: any) => selectedTokens.includes(token.name + '+'))"
          :key="`balance-${token.name}`"
        >
          {{ getBalance(portfolioBalanceData[`data${token.name}Plus`], token.isETH) }}
        </p>
      </div>
      <div class="dasboard__tokens-data-balances-dollars">
        <p>USD balance</p>
        <p
          v-for="token in availableTokensBalancesProfit
            .filter((token: any) => selectedTokens.includes(token.name + '+'))"
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
          v-for="token in availableTokensBalancesProfit
            .filter((token: any) => selectedTokens.includes(token.name + '+'))"
          :key="`profit-${token.name}`"
        >
          {{ calculateProfit(portfolioBalanceData[`data${token.name}Plus`]) }}
        </p>
        <p class="dasboard__tokens-data-total">{{totalProfit()}}</p>
      </div>
      <div class="dashboard__divider-last" />
    </div>
    <div
      v-else
      class="dasboard__tokens-data-balances-profit"
    >
      <div class="dasboard__tokens-data-total-mobile">
        <div class="dasboard__tokens-data-total-mobile-item">
          <p class="dasboard__tokens-data-total-title">TOTAL</p>
          <p class="dasboard__tokens-data-total-period">{{getFormattedPeriod}}</p>
        </div>
        <div class="dashboard__divider" />
        <div class="dasboard__tokens-data-total-mobile-item">
          <p>USD Balance</p>
          <p class="dasboard__tokens-data-total">{{getTotalBalance()}}</p>
        </div>
        <div class="dashboard__divider" />
        <div class="dasboard__tokens-data-total-mobile-item">
          <p>Profit</p>
          <p class="dasboard__tokens-data-total">{{totalProfit()}}</p>
        </div>
        <div
          v-for="(token, index) in availableTokens
            .filter((token: any) => selectedTokens.includes(token.name))"
          :key="index"
          class="dasboard__tokens-data-token-mobile"
        >
          <div class="dasboard__tokens-data-token">
            <div class="dasboard__tokens-data-token-icon">
              <BaseIcon :name="token.iconName" />
              <p>{{ token.name }}</p>
            </div>
          </div>
          <div class="dasboard__tokens-data-token-balance">
            <p>Token balance</p>
            <p>
              {{ calculateProfit(portfolioBalanceData[`data${token.name.slice(0, -1)}Plus`]) }}
            </p>
          </div>
          <div class="dashboard__divider" />
          <div class="dasboard__tokens-data-usd-balance">
            <p>USD balance</p>
            <p>
              {{ getBalanceUSD(getBalance(portfolioBalanceData[`data${token.name.slice(0, -1)}Plus`], token.isETH), token.name.slice(0, -1).toLowerCase() + 'Plus') }}
            </p>
          </div>
          <div class="dashboard__divider" />
          <div class="dasboard__tokens-data-token-profit">
            <p>Profit</p>
            <p>
              {{ calculateProfit(portfolioBalanceData[`data${token.name.slice(0, -1)}Plus`]) }}
            </p>
          </div>
          <div class="dashboard__divider" />
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';
import ButtonComponent from '@/components/Button/Index.vue';
import { deviceType } from '@/utils/deviceType.ts';
import { getFormattedPeriodDashboard } from '@/store/helpers/index.ts';

export default {
  name: 'TokensPlusDashboard',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  data() {
    return {
      selectedTokens: [] as string[],
      tokenDisplayInfo: {
        usdPlus: { name: 'USD+', iconName: 'USD+_market' },
        daiPlus: { name: 'DAI+', iconName: 'DAI+_market' },
        usdtPlus: { name: 'USDT+', iconName: 'USDT_market' },
        ethPlus: { name: 'ETH+', iconName: 'DashboardETH+Tokens' },
        usdcPlus: { name: 'USDC+', iconName: 'USDC+dashboard' },
      },
    };
  },
  props: {
    portfolioBalanceData: {
      type: Object,
      default: () => ({}),
    },
    portfolioBalanceDataFull: {
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
    device() {
      return deviceType();
    },
    getDashboardInterval() {
      return this.$store.state.intervalDashboard.intervalDashboard;
    },
    networkName() {
      return this.$store.state.network.dashboardNetwork;
    },
    currentIntervalDashboard() {
      return this.$store.state.intervalDashboard.intervalDashboard;
    },
    availableTokens(): any {
      const currentChainTokens = chainContractsMap[this.networkName
        .toLowerCase() as keyof typeof chainContractsMap];
      if (!currentChainTokens) {
        return [];
      }
      return Object.keys(currentChainTokens)
        .filter((token) => token.endsWith('Plus') && (currentChainTokens as any)[token].tokenPlus)
        .map((token) => ({
          ...(this.tokenDisplayInfo[token as keyof typeof this.tokenDisplayInfo]),
          contractAddress: (currentChainTokens as any)[token].tokenPlus,
        }))

        .filter((token) => token.name);
    },
    availableTokensBalancesProfit() {
      const currentChain = this.networkName;
      const tokensOnCurrentChain = chainContractsMap[currentChain as
        keyof typeof chainContractsMap];
      return Object.entries(tokensOnCurrentChain)
        .filter(([key, value]) => key.endsWith('Plus') && (value as any).tokenPlus)
        .map(([key]) => ({
          name: key.toUpperCase().slice(0, -4),
          iconName: `Dashboard${key.charAt(0).toUpperCase() + key.slice(1)}Tokens`,
          isETH: key === 'ethPlus',
        }));
    },
    getFormattedPeriod() {
      return getFormattedPeriodDashboard(this.getDashboardInterval, this.portfolioBalanceDataFull);
    },
  },
  methods: {
    selectAllTokens() {
      this.selectedTokens = this.availableTokens.map((token: any) => token.name);
    },
    toggleTokenSelection(tokenName: any) {
      const index = this.selectedTokens.indexOf(tokenName);
      if (index === -1) {
        this.selectedTokens.push(tokenName);
      } else {
        this.selectedTokens.splice(index, 1);
      }
    },
    getBalance(balance: any, isETH: boolean) {
      const filteredBalance = [...balance]
        .filter((transaction) => transaction.type === 'PAYOUT');
      if (!Array.isArray(filteredBalance) || filteredBalance.length === 0) {
        return isETH ? '0.000000' : '0.00';
      }
      const balanceNumber = filteredBalance[0].closing_balance;
      if (isETH) {
        return parseFloat(balanceNumber).toFixed(6);
      } return parseFloat(balanceNumber).toFixed(2);
    },

    getBalanceUSD(balance: any, tokenName: string) {
      const price = this.portfolioBalanceData.prices[tokenName];
      if (!price) {
        console.error('Price for the given token name is not found.');
        return '$0,0000';
      }

      const valueInUSD = balance * price;

      const formattedValueInUSD = new Intl.NumberFormat('en-EN', {
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

      return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
      }).format(totalProfit);
    },
    totalProfit() {
      let totalProfitUSD = 0;

      this.selectedTokens.forEach((token) => {
        const tokenDataKey = `data${token.replace('+', '')}Plus`;
        const tokenData = this.portfolioBalanceData[tokenDataKey];
        if (tokenData) {
          const profit = parseFloat(this.calculateProfit(tokenData).replace(',', '.').replace(' $', ''));
          totalProfitUSD += !Number.isNaN(profit) ? profit : 0;
        }
      });

      return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
      }).format(totalProfitUSD);
    },

    getTotalBalance() {
      let totalBalanceUSD = 0;

      this.selectedTokens.forEach((token) => {
        const tokenDataKey = `data${token.replace('+', '')}Plus`;
        const tokenData = this.portfolioBalanceData[tokenDataKey];
        if (tokenData) {
          const balanceUSD = this.getBalanceUSD(
            this.getBalance(tokenData, token.includes('ETH')),
            `${token.replace('+', '').toLowerCase()}Plus`,
          ).replace('$', '').replace(',', '.');
          totalBalanceUSD += parseFloat(balanceUSD);
        }
      });

      return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(totalBalanceUSD);
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
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.dasboard__tokens-data-balances :nth-child(1),
.dasboard__tokens-data-balances-dollars :nth-child(1),
.dasboard__tokens-data-profit :nth-child(1) {
  margin-bottom: 24px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.dasboard__tokens-data-tokens-wrapper {
  display: flex;
  flex-direction: row;
}

.dasboard__tokens-data-tokens-title {
  margin-bottom: 18px;
  text-align: center;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
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
  svg {
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }
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
  opacity: 0.7;
  svg {
    overflow: hidden;
    border-radius: 50%;
    width: 22px;
    height: 22px;
  }
}

.dashboard__tokens-data-icon-wrapper:not(:last-child) {
  margin-right: 8px;
}

.dashboard__tokens-data-token-selected {
  opacity: 1;
}
.dasboard__tokens-data-profit p {
  text-align: center;
}
.dashboard__tokens-data-select {
  display: flex;
  flex-direction: row;
  margin-bottom: 26px;
  button {
    background: none;
    border: none;
    box-shadow: none;
    font-size: 9px;
    display: flex;
    max-width: 30px;
    text-align: center;
    margin-right: 12px;
    color: var(--color-3);
    [data-theme="dark"] & {
      background: none;
      box-shadow: none;
    }
  }
  svg {
    border-radius: 50%;
    width: 22px;
    height: 22px;
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
  margin-top: 22px;
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

@media (max-width: 640px) {
  .dashboard__tokens-data-select {
    gap: 12px;
  }
  .dashboard__tokens-data-icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    p {
      font-size: 12px;
      color: var(--color-1);
      [data-theme="dark"] & {
        color: var(--color-4);
      }
    }
  }
  .dasboard__tokens-data-total-mobile {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .dashboard__divider,
  .dasboard__tokens-data-total {
    padding: 0;
    margin: 0;
  }
  .dashboard__divider {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .dasboard__tokens-data-total-mobile-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }

  .dasboard__tokens-data-total-title {
    font-size: 16px;
    color: var(--color-1);
    font-weight: 600;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .dasboard__tokens-data-token-mobile {
    display: flex;
    flex-direction: column;
    margin-top: 22px;
  }
  .dasboard__tokens-data-token-mobile p:first-child {
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }

  .dasboard__tokens-data-total-period {
    [data-theme="dark"] & {
      color: var(--color-18) !important;
    }
  }

  .dasboard__tokens-data-token {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .dasboard__tokens-data-token-icon {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: auto;
    svg {
      margin-right: 10px;
    }
  }

  .dasboard__tokens-data-token-balance,
  .dasboard__tokens-data-usd-balance,
  .dasboard__tokens-data-token-profit {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .dasboard__tokens-data-token-balance p:last-child,
  .dasboard__tokens-data-usd-balance p:last-child,
  .dasboard__tokens-data-token-profit p:last-child {
    color: var(--color-1);
    font-size: 14px;
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .dasboard__tokens-data-total-mobile-item p:first-child {
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
  .dasboard__tokens-data-token-balance p:first-child,
  .dasboard__tokens-data-usd-balance p:first-child,
  .dasboard__tokens-data-token-profit p:first-child,
  .dasboard__tokens-data-total-mobile-item p:first-child {
    font-size: 12px;
  }
  .dasboard__tokens-data-total-title {
    font-size: 16px !important;
    [data-theme="dark"] & {
      color: var(--color-4) !important;
    }
  }

  .dasboard__tokens-data-total-mobile-item p:last-child,
  .dasboard__tokens-data-token-form-period {
    font-size: 14px;
  }
  .dasboard__tokens-data-total-mobile-item p:last-child {
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
  .dasboard__tokens-data-token {
    margin-bottom: 16px;
  }

  .dasboard__tokens-data-token-icon {
    svg {
      border-radius: 50%;
      overflow: hidden;
      scale: 150%;
    }
    p {
      font-size: 16px;
      color: var(--color-1);
      font-weight: 600;
      [data-theme="dark"] & {
        color: var(--color-4);
      }
    }
  }
}

</style>

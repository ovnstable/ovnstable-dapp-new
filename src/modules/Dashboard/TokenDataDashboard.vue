<template>
  <div class="dashboard__token-data">
    <div class="dashboard__token-data-from">
      <BaseIcon
        name="DashboardUsdPlus"
        class="dashboard__token-data-main-token"
      />
      <div class="dashboard__token-data-link-title">
        <p class="dashboard__token-data-title--token"> USD+ </p>
        <p class="dashboard__token-data-title-period">From 01 Jan ‘24</p>
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
        <p class="dashboard__token-data-num"> $ 4.0685</p>
        <p class="dashboard__token-data-growth-balance">+14.23%</p>
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
import { chainContractsMap } from '@/utils/contractsMap.ts';

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
      return this.$store.state.network.marketNetwork;
    },
    networkScan() {
      return this.$store.state.network.marketExplorerURL;
    },
    availableChains() {
      const tokenKey = `${this.tokenData.tokenName?.toLowerCase()?.slice(0, -1)}Plus`;
      if (!tokenKey) return [];
      const availableNetworks = Object.entries(chainContractsMap)
        .reduce((acc, [network, tokens]: any) => {
          if ((tokenKey in tokens) && tokens[tokenKey].tokenPlus) {
            acc.push(network.charAt(0).toUpperCase() + network.slice(1));
          }
          return acc;
        }, [] as string[]);

      return availableNetworks;
    },
  },
  methods: {
    saveNetworkToLocalStore(chain:string) {
      this.$store.dispatch('network/changeMarketNetwork', chain.toLowerCase());
    },
    generateHref(tokenName:string, networkName:string) {
      if (!tokenName) {
        return '';
      }

      const tokenKey = `${tokenName.toLowerCase()?.slice(0, -1)}Plus`;
      if (!tokenKey) return '';
      const networkContracts = (chainContractsMap as any)[networkName.toLowerCase()];
      if (!networkContracts || !(tokenKey in networkContracts)) {
        console.error(`Contracts not found for ${tokenKey} on ${networkName}`);
        return '';
      }

      const { tokenPlus } = networkContracts[tokenKey];

      if (!tokenPlus) {
        console.error(`Address not found for ${tokenKey} on ${networkName}`);
        return '';
      }

      return tokenPlus;
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

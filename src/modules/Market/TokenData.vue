<template>
  <div
    v-if="device.isMobile"
    class="performance__token-data-markets"
  >
    <router-link
      v-for="link in linksData"
      :key="link.name"
      :to="{ path: link.to, query: { chain: link.name } }"
      class="sidebar__text-market"
      active-class="active-link"
    >
      <div class="performance__token-data-markets-links">
        <BaseIcon
          :name="link.iconName"
          :class="{ 'inactive-link': link.name !== tokenData.tokenName }"
        />
        <p>{{ link.name }}</p>
      </div>

    </router-link>
  </div>
  <div class="performance__token-data">
    <div class="performance__token-data-header">
      <BaseIcon
        :name="tokenData.tokenImageName"
        class="performance__token-data-main-token"
      />
      <div class="performance__token-data-link-title">
        <p class="performance__token-data-title performance__token-data-title--token">{{ tokenData.tokenName }}</p>
        <a
          :href="tokenLink"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="token-address"
          class="performance__token-data-link-addr link-ovn"
        >Token address</a>
      </div>
      <p class="performance__token-data__description">{{ tokenData.description }}</p>
    </div>

    <div class="performance__divider" />
    <div class="performance__payout-data">
      <p class="performance__token-data-title">Last payout</p>
      <p class="performance__token-data-num performance__token-data-num--payout-ago">{{ tokenData.lastPayoutTime }}</p>
      <p class="performance__token-data-h">{{ tokenData.lastPayoutType }}</p>
    </div>
    <div class="performance__divider" />
    <div class="performance__apy-data">
      <p class="performance__token-data-title">Daily APY</p>
      <div class="performance__apy-data-chain">
        <p class="performance__token-data-num performance__token-data-num--apy-num">{{ tokenData.dailyApy }}%</p>
        <div
          class="performance__icon-chain"
        >
          <BaseIcon
            :name="networkName.toLocaleLowerCase()"
          />
        </div>
      </div>
    </div>
    <div class="performance__divider" />
    <div class="performance__tvl-data">
      <p class="performance__token-data-title">{{ tokenData.tokenName }} TVL</p>
      <p class="performance__token-data-num">{{ tokenData.tvl }}     <span class="performance__token-data-col-token">
        {{ tokenData.collateralToken === 'WETH' ? tokenData.collateralToken : '$' }}
      </span></p>
      <p class="performance__token-data-h">past 2 hours</p>
    </div>
    <div class="performance__divider performance__divider--last-divider" />
  </div>

  <div class="performance__chain-data-container">
    <div
      v-for="chain in availableChains"
      :key="chain"
      @click="saveNetworkToLocalStore(chain)"
      @keydown.enter="saveNetworkToLocalStore(chain)"
      class="performance__chain-data"
      :class="{ selected: chain.toLowerCase() === networkName }"
    >
      <BaseIcon
        :name="chain.toLocaleLowerCase()"
        class="performance__icon-chain-bottom"
      />
      <p class="performance__chain-data-name">{{ chain }}</p>
    </div>
  </div>

</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';
import { deviceType } from '@/utils/deviceType.ts';

export default {
  name: 'TokenDataPerformance',
  components: {
    BaseIcon,
  },
  data() {
    return {
      linksData: [
        { name: 'USD+', to: '/market/usd', iconName: 'USD+_market' },
        { name: 'USDC+', to: '/market/usdc', iconName: 'USDC+_Account' },
        { name: 'ETH+', to: '/market/eth', iconName: 'DashboardETH+Tokens' },
        { name: 'USDT+', to: '/market/usdt', iconName: 'USDT_market' },
        { name: 'DAI+', to: '/market/dai', iconName: 'DAI+_market' },
      ],
    };
  },
  props: {
    tokenData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    tokenLink() {
      const path = this.networkName === 'zksync' ? 'address' : 'token';
      const genHref = this.generateHref(this.tokenData.tokenName, this.networkName);
      return `${this.networkScan}${path}/${genHref}`;
    },
    device() {
      return deviceType();
    },
    networkName() {
      const marketUrlNetwork = this.$route.query.chain;
      return marketUrlNetwork || this.$store.state.network.marketNetwork;
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
      this.$router.replace({ query: undefined });
      this.$store.dispatch('network/changeMarketNetwork', chain.toLowerCase());
    },
    generateHref(tokenName:string, networkName:string) {
      if (!tokenName) return '';

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
  },
};
</script>

<style lang="scss" scoped>

.performance__token-data-header {
  display: flex;
  flex-direction: row;
}

.performance__token-data {
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  background: var(--color-4);
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-17);
  }
}

.performance__icon-token {
  width: 90px;
  height: 90px;
}
.performance__token-data-link-title {
  display:flex;
  flex-direction: column;
  margin-left: 20px;
}
.performance__token-data-title {
  text-align: left;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.performance__token-data-title--token {
  color: var(--color-1);
  font-size: 22px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.performance__token-data-link-addr {
  margin-top: 10px;
  min-width: 79px;
  color: var(--color-2);
  font-size: 12px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.performance__token-data__description {
  margin-left: 30px;
  color: var(--color-2);
  text-align: justify;
  font-size: 12px;
  font-weight: 400;
  max-width: 186px;
  line-height: 1.1;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.performance__divider {
  margin-left: 30px;
  margin-right: 30px;
  border: 1px solid var(--color-7);
  [data-theme="dark"] & {
    border-color: var(--color-2);
  }
}

.performance__divider--last-divider {
  margin-right: 0;
}

.performance__payout-data,
.performance__apy-data,
.performance__tvl-data {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.performance__token-data-num,
.performance__token-data-col-token {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 500;
}

.performance__token-data-num {
  display: flex;
  margin-top: 20px;
  text-align: center;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.performance__token-data-num--apy-num {
  margin-top: 0px;
}
.performance__apy-data-chain {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.performance__icon-chain {
  margin-left: 10px;

  svg {
    overflow: visible;
    width: 24px;
    height: 24px;
  }
}

.performance__token-data-h {
  color: var(--color-1);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.performance__chain-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--color-5);
  padding: 5px 10px;
  margin-top: 24px;
  width: fit-content;
  transition: background 0.3s ease, border 0.3s ease;
  svg {
    width: 24px;
    height: 24px;
    filter: grayscale(10);
    opacity: .5;
  }
  [data-theme="dark"] & {
    background: var(--color-7);
  }
}
.selected {
  background: var(--color-4);
  color: var(--color-3);
  border-color: var(--color-6);
  svg {
    opacity: 1;
    filter: unset;
    border-radius: 50%;
    overflow: visible;
  }
  [data-theme="dark"] & {
    background: var(--color-17);
  }
}

.performance__chain-data-container .selected:hover {
  background: var(--color-4);
  cursor: default;
  [data-theme="dark"] & {
    background: var(--color-2);
  }
}

.performance__chain-data:hover {
  cursor: pointer;
  border: 1px solid var(--color-7);
  background: var(--color-6);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-2);
  }
}

.performance__chain-data-name {
  margin-left: 8px;
  font-weight: 500;
  font-size: 13px;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.performance__icon-chain-bottom {
  overflow: visible;
  flex-shrink: 0
}

.performance__chain-data-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.performance__chain-data-container > *:not(:last-child) {
  margin-right: 7px;
}

.performance__token-data-main-token {
  min-width: 70px;
  [data-theme="dark"] & {
    border: 1px solid var(--color-4);
    border-radius: 50%;
  }
}

@media (max-width: 1024px) {
  .performance__chain-data-container {
    justify-content: space-between;
  }
  .performance__chain-data {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 30px;
    padding: 2px 5px;
    margin-top: 24px;
  }
  .performance__token-data-main-token {
    scale: 90%;
  }
  .performance__token-data-col-token {
    margin-left: 2px;
  }
  .performance__token-data__description {
    margin-left: 5px;
    max-width: 150px;
  }
  .performance__token-data-link-title {
    margin-left: 5px;
  }

  .performance__token-data-h {
    font-size: 12px;
  }
  .performance__divider {
    margin-left: 5px;
    margin-right: 5px;
  }
}

@media (max-width: 640px) {
  .performance__token-data-header {
    width: 100%;
    margin-bottom: 6px;
  }
  .performance__token-data-main-token {
    width: 40px;
    overflow: visible;
    min-width: 58px;
    height: 40px;
  }
  .performance__token-data-link-addr {
    margin-top: 18px;
  }
  .performance__token-data-link-title {
    margin-left: 10px;
  }
  .performance__token-data-title--token {
    font-size: 16px;
    margin-left: 0;
  }
  .performance__token-data__description {
    margin-top: 0;
    margin-left: 10px;
    max-width: 138px;
  }
  .performance__divider {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .performance__payout-data,
  .performance__apy-data,
  .performance__apy-data-chain,
  .performance__tvl-data {
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    p {
      margin-top: 0;
    }
  }
  .performance__payout-data p:first-child,
  .performance__tvl-data p:first-child {
    font-size: 12px;
    margin-right: auto
  }
  .performance__apy-data {
    .performance__token-data-title {
      font-size: 12px;
      width: 100%;
      margin-right: auto;
    }
  }
  .performance__apy-data-chain {
    align-items: center;
    justify-content: right;
  }
  .performance__token-data-num--payout-ago,
  .performance__token-data-num {
    font-size: 14px;
    margin-right: 10px;
  }
  .performance__token-data-col-token {
    font-size: 14px;
  }
  .performance__apy-data p {
    text-align: left;
  }
  .performance__icon-chain {
    margin: 0;
  }

  .performance__chain-data-container {
    justify-content: space-between;
  }
  .performance__token-data-markets {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .performance__token-data-markets-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    p {
      font-size: 12px;
      color: var(--color-1);
      margin-left: 4px
    }
    svg {
      border-radius: 50%;
    }
    .inactive-link {
      opacity: 0.5;
      filter: grayscale(10);
    }
  }
  .performance__token-data-markets {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .performance__token-data-markets-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    p {
      font-size: 12px;
      color: var(--color-1);
      margin-left: 4px
    }
    svg {
      border-radius: 50%;
    }
    .inactive-link {
      opacity: 0.5;
      filter: grayscale(10);
    }
  }
  .performance__chain-data {
    width: 36px;
    height: 36px;
    align-items: center;
  }
  .performance__chain-data-name {
    display: none;
  }
  .performance__token-data {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .performance__divider {
    width: 100%;
  }
  .performance__token-data-title--token {
    margin-left: 20px;
  }
  .performance__token-data-title {
    max-width: none;
  }
  .performance__token-data__description {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .performance__token-data-title {
    margin-top: 10px;
  }
  .performance__token-data-num {
    margin-top: 6px;
  }
  .performance__apy-data-chain {
    margin: 0;
  }
  .performance__divider {
    margin-left: 5px;
    margin-right: 5px;
  }
  .performance__payout-data,
  .performance__apy-data,
  .performance__apy-data-chain,
  .performance__tvl-data {
    min-height: 27px;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    p {
      margin-top: 0;
    }
  }
    .performance__divider {
    margin-top: 12px;
    margin-bottom: 12px;
  }
    .performance__token-data-header {
    width: 100%;
    margin-bottom: 6px;
  }
  .performance__token-data__description {
    margin-left: 20px;
  }
  .performance__token-data-num  {
    margin-left: auto;
  }
  .performance__token-data-h {
    margin-left: 10px;
  }
  .performance__apy-data-chain {
    svg {
      margin-left: 10px;
    }
  }

}

@media (max-width: 380px) {
  .performance__chain-data {
    min-width: 10px;
    max-width: 18%;
    flex: 0 0 20%;
    padding: 0;
    justify-content: center;
  }
  .performance__chain-data-container > * {
    margin-right: 7px;
  }
}

</style>

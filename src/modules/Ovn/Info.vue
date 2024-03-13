<template>

  <div
    v-if="!loaded"
  >
    <div class="ovn__loader">
      <Spinner />
    </div>

  </div>
  <div
    v-else-if="!device.isMobile"
    class="ovn__overview"
  >
    <div class="ovn__overview-links">
      <BaseIcon
        class='ovn__overview-links-image'
        name="OVN_LOGO_dark"
      />
      <div class="ovn__overview-links-data">
        <p>OVN</p>
        <a
          :href="`${networkScan}token/` + generateHref('ovn', networkName)"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="token-address"
          class="ovn__overview-link-addr link-ovn"
        >Token address</a>
        <a
          href="https://coinmarketcap.com/currencies/overnight/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="token-address"
          class="ovn__overview-link-cmc link-ovn"
        >Coinmarketcap</a>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-price">
      <p class="ovn__overview-price-title">OVN Price</p>
      <div class="ovn__overview-price-change">
        <p>{{priceOvn}}</p>
        <p :class="priceOvnChange < 0 ? 'ovn__overview-price-down' : 'ovn__overview-price-up'">{{ priceOvnChange }}% (1d)</p>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-mc">
      <p class="ovn__overview-mc-title">Market cap</p>
      <div class="ovn__overview-mc-change">
        <p>${{formatNumber(marketCap)}}</p>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-tvl">
      <p class="ovn__overview-tvl-title">OVN TVL</p>
      <div class="ovn__overview-exact-chain">
        <div
          class="ovn__overview-icon-chain"
        >
          <BaseIcon
            :name="networkName.toLocaleLowerCase()"
          />
        </div>

        <p>${{ formatNumber(tokenData.ovnTVL) }}</p>
      </div>
      <p>past 2 hours</p>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-interact-buttons">
      <router-link
        to="/"
      >
        <ButtonComponent
          class="ovn__overview-button"
        >
          <BaseIcon
            class="ovn__overview-mint-icon"
            name='InsuranceMint'
          />
          MINT / REDEEM
          <BaseIcon
            name='InsuranceRedeem'
            class="ovn__overview-redeem-icon"
          />
        </ButtonComponent>
      </router-link>
      <router-link
        to="/"
      >
        <ButtonComponent class="ovn__overview-button">
          <BaseIcon
            class="ovn__overview-bridge-icon"
            name='InsuranceBridge'
          />
          BRIDGE
        </ButtonComponent>
      </router-link>
      <ButtonComponent class="ovn__overview-button">
        <BaseIcon
          class="ovn__overview-dashboard-icon"
          name='InsuranceOVN'
        />
        OVN DASHBOARD
      </ButtonComponent>

    </div>

  </div>
  <div v-else-if="loaded && device.isMobile">
    <div class="ovn__overview-links">
      <BaseIcon
        class='ovn__overview-links-image'
        name="OVN_LOGO_dark"
      />
      <div class="ovn__overview-links-data">
        <p>OVN</p>
        <div class="ovn__overview-links-data-cmc-addr">
          <a
            :href="`${networkScan}token/` + generateHref('ovn', networkName)"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="token-address"
            class="ovn__overview-link-addr link-ovn"
          >Token address</a>
          <a
            href="https://coinmarketcap.com/currencies/overnight/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="token-address"
            class="ovn__overview-link-cmc link-ovn"
          >Coinmarketcap</a>

        </div>

      </div>
      <div class="ovn__overview-links-data-button">
        <ButtonComponent class="ovn__overview-button">
          <BaseIcon
            class="ovn__overview-dashboard-icon"
            name='InsuranceOVN'
          />
        </ButtonComponent>
        <p>MY OVN</p>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-price">
      <p class="ovn__overview-price-title">OVN Price</p>
      <div class="ovn__overview-price-change">
        <p>{{priceOvn}}</p>
        <p :class="priceOvnChange < 0 ? 'ovn__overview-price-down' : 'ovn__overview-price-up'">{{ priceOvnChange }}% (1d)</p>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-mc">
      <p class="ovn__overview-mc-title">Market cap</p>
      <div class="ovn__overview-mc-change">
        <p>${{formatNumber(marketCap)}}</p>
      </div>
    </div>
    <div class="ovn__overview-divider" />
    <div class="ovn__overview-tvl">
      <p class="ovn__overview-tvl-title">OVN TVL</p>
      <div class="ovn__overview-exact-chain">
        <div
          class="ovn__overview-icon-chain"
        >
          <BaseIcon
            :name="networkName.toLocaleLowerCase()"
          />
        </div>

        <p>${{ formatNumber(tokenData.ovnTVL) }}</p>
        <p>past 2 hours</p>
      </div>

    </div>
    <div class="ovn__overview-divider" />
  </div>
  <div class="ovn__overview-chain-data-container">
    <div
      v-for="chain in availableChains"
      :key="chain"
      @click="saveNetworkToLocalStore(chain)"
      @keypress="saveNetworkToLocalStore(chain)"
      class="ovn__overview-chain-data"
      :class="{ selected: (chain as any).toLowerCase() === networkName }"
    >
      <BaseIcon
        :name="chain.toLocaleLowerCase()"
      />
      <p
        v-if="!device.isMobile"
        class="ovn__overview-chain-data-name"
      >{{ chain }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import ButtonComponent from '@/components/Button/Index.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';
import { deviceType } from '@/utils/deviceType.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'OvnInfo',
  components: {
    ButtonComponent,
    BaseIcon,
    Spinner,
  },
  props: {
    tokenData: {
      type: Object,
      default: () => ({}),
    },
    loaded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    device() {
      return deviceType();
    },
    priceOvn() {
      return this.tokenData.priceOvnMcChange.data.OVN[0].quote.USD.price.toFixed(2);
    },
    priceOvnChange() {
      return this.tokenData.priceOvnMcChange.data.OVN[0].quote.USD.percent_change_1h.toFixed(2);
    },
    marketCap() {
      return this.tokenData.priceOvnMcChange.data.OVN[0].self_reported_market_cap.toFixed(2);
    },
    networkName() {
      return this.$store.state.network.ovnNetwork;
    },
    networkScan() {
      return this.$store.state.network.ovnExplorerURL;
    },
    availableChains() {
      const availableNetworks = Object.entries(chainContractsMap)
        .reduce((acc: string[], [network, contracts]: [string, any]) => {
          if (contracts.ovn) {
            acc.push(network.charAt(0).toUpperCase() + network.slice(1));
          }
          return acc;
        }, []);

      return availableNetworks;
    },
  },
  methods: {
    saveNetworkToLocalStore(chain: string) {
      this.$store.dispatch('network/changeOvnNetwork', chain.toLowerCase());
    },
    generateHref(tokenName: string, networkName: string) {
      const networkContracts = (chainContractsMap as any)[networkName.toLowerCase()];
      const tokenOvn = networkContracts[tokenName];
      return tokenOvn;
    },
    formatNumber(value: any) {
      return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    },
  },
};

</script>

<style lang="scss" scoped>
.ovn__loader {
  min-height: 102px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ovn__overview {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.ovn__overview-tvl,
.ovn__overview-buttons {
  display: flex;
  flex-direction: column;
}
.ovn__overview-price,
.ovn__overview-mc,
.ovn__overview-tvl {
  text-align: center;
}

.ovn__overview-price-title,
.ovn__overview-mc-title,
.ovn__overview-tvl-title {
  font-size: 15px;
  margin-bottom: 10px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.ovn__overview-tvl p:last-child,
.ovn__overview-mc-change {
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.ovn__overview-mint-icon,
.ovn__overview-bridge-icon,
.ovn__overview-dashboard-icon {
  margin-right: 4px;
}
.ovn__overview-redeem-icon {
  margin-left: 4px;
}

.ovn__overview-divider {
  border: 1px solid var(--color-7);
}
.ovn__overview-links {
  display: flex;
  flex-direction: row;
}
.ovn__overview-links-data {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.ovn__overview-links-data p:nth-child(1),
.ovn__overview-price-change p:nth-child(1),
.ovn__overview-mc-change p:nth-child(1) {
  font-size: 20px;
  color: var(--color-1);
  font-weight: 500;
  margin-bottom: 10px;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.ovn__overview-exact-chain {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
  p {
    font-size: 20px;
    color: var(--color-1);
    font-weight: 500;
  }
}
.ovn__overview-button {
  background-color: var(--color-5);
  color: var(--color-1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  border: none;
  border-radius: 30px;
  padding: 5px 14px;
  [data-theme="dark"] & {
    background-color: var(--color-7);
    border: none;
    box-shadow: none;
  }
}
.ovn__overview-interact-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  [data-theme="dark"] & {
    svg:not(.insurance__mint-button) {
      fill: var(--color-1);
    }
  }

  .insurance__mint-button {
    stroke: var(--color-1);
    [data-theme="dark"] & {
      fill: var(--color-4);
    }
  }
}
.ovn__overview-links-data p:nth-child(1) {
  margin-bottom: 10px;
}
.ovn__overview-link-addr {
  margin-bottom: 4px;
}
.ovn__overview-link-addr,
.ovn__overview-link-cmc {
  font-size: 12px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.ovn__overview-price-down,
.ovn__overview-price-up {
  font-weight: 600;
  font-size: 15px;
}

.ovn__overview-price-down {
  color: var(--color-9);
}

.ovn__overview-price-up {
  color: var(--color-11);
}

.ovn__overview-icon-chain {
  margin-right: 4px;
  svg {
    width: 24px;
    height: 24px;
  }
}
.ovn__overview-chain-data-container .selected {
  background: var(--color-4);
  color: var(--color-3);
  border-color: var(--color-6);
  svg {
    opacity: 1;
    filter: unset;
  }
  [data-theme="dark"] & {
    p {
      color: var(--color-4);
    }
    border-color: var(--color-2);
    background: var(--color-17);
  }
}
.ovn__overview-chain-data-container {
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  vertical-align: center;
  transition: background 0.3s ease, border 0.3s ease;
  svg {
    width: 24px;
    height: 24px;
    filter: grayscale(10);
    opacity: .5;
  }
}

.ovn__overview-chain-data-container > *:not(:last-child) {
  margin-right: 7px;
}
.ovn__overview-chain-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  border: 1px solid var(--color-5);
  padding: 5px 10px;
  width: fit-content;
  background-color: var(--color-5);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
   border-color: var(--color-7);
   background: var(--color-7);
  }
}
.ovn__overview-chain-data-name {
  margin-left: 8px;
  font-weight: 500;
  font-size: 13px;
  color: var(--color-1);
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.ovn__overview-chain-data:hover {
  cursor: pointer;
  border: 1px solid var(--color-7);
  background: var(--color-6);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-2);
  }
}

.selected:hover {
  cursor: default;
  border: 1px solid var(--color-7);
  background: var(--color-4);
  transition: background 0.3s ease, border 0.3s ease;
  [data-theme="dark"] & {
    background: var(--color-7);
  }
}

@media (max-width: 768px) {
  .ovn__overview-price-title,
  .ovn__overview-mc-title,
  .ovn__overview-tvl-title,
  .ovn__overview-price-up,
  .ovn__overview-button {
    font-size: 13px;
  }
  .ovn__overview-links-data p:nth-child(1),
  .ovn__overview-price-change p:nth-child(1),
  .ovn__overview-mc-change p:nth-child(1),
  .ovn__overview-exact-chain p {
    font-size: 17px;
  }
}
@media (max-width: 400px) {
  .ovn__overview-links {
    display: flex;
    align-items: center;
  }
  .ovn__overview-links-image {
    scale: 50%;
  }
  .ovn__overview-links-data {
    margin-left: 0;
  }
  .ovn__overview-links-data-cmc-addr {
    display: flex;
    flex-direction: row;
    gap: 14px;
  }
  .ovn__overview-links-data-button {
    align-items: center;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
    p {
      font-size: 12px;
      color: var(--color-2);
      margin-bottom: 16px;
    }
  }
  .ovn__overview-dashboard-icon {
    padding: 0;
    margin: 0;
    scale: 150%;
  }
  .ovn__overview-button {
    border-radius: 50%;
    padding: 11px 11px;
  }
  .ovn__overview-price-change p:nth-child(1),
  .ovn__overview-price-title,
  .ovn__overview-mc-title,
  .ovn__overview-mc-change p:nth-child(1),
  .ovn__overview-exact-chain,
  .ovn__overview-tvl-title {
    margin: 0;
  }
  .ovn__overview-price,
  .ovn__overview-price-change,
  .ovn__overview-mc,
  .ovn__overview-tvl {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .ovn__overview-price,
  .ovn__overview-mc,
  .ovn__overview-tvl,
  .ovn__overview-chain-data-container {
    justify-content: space-between;
  }
}

</style>

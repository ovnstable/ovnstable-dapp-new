<template>
  <div class="insurance__info">
    <BaseIcon
      :name="tokenData.insuranceImage"
      class="insurance__token-image"
    />
    <div class="insurance__token-title">
      <div class="insurance__title-token-info">
        <p class="insurance__token-data-title insurance__token-data-title--token">INSURANCE</p>
        <div class="insurance__links-info">
          <a
            :href="`${networkScan}address/` + generateHref(tokenData.tokenName, networkName)"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="token-address"
            class="insurance__token-data-link-addr link-ovn"
          >Token address</a>
          <a
            href="https://docs.overnight.fi/governance/ovn-token"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="token-address"
            class="insurance__token-data-link-addr link-ovn"
          >What is ovn</a>
        </div>
      </div>

      <div class="insurance__title-buttons">
        <div class="insurance__interact-buttons">
          <ButtonComponent class="insurance__title-button">
            <BaseIcon
              name='Insurance_Mint'
            />
            MINT / redeem
            <BaseIcon
              name='Insurance_Redeem'
              class="insurance__redeem-button"
            />
          </ButtonComponent>
          <ButtonComponent class="insurance__title-button">
            <BaseIcon
              name='Insurance_Bridge'
            />
            Bridge
          </ButtonComponent>
          <ButtonComponent class="insurance__title-button">
            <BaseIcon
              name='Insurance_OVN'
            />
            OVN Dashboard
          </ButtonComponent>
        </div>
        <ButtonComponent class="insurance__title-button">
          <BaseIcon
            name='Insurance_About'
          />
          About Insurance
        </ButtonComponent>
      </div>
    </div>

  </div>
  <div class="performance__token-data">

    <p class="performance__token-data__description">{{ tokenData.description }}</p>
    <div class="performance__divider" />
    <div class="performance__payout-data">
      <p class="insurance__token-data-title">Last payout</p>
      <p class="performance__token-data-num performance__token-data-num--payout-ago">{{ tokenData.lastPayoutTime }}</p>
      <p class="performance__token-data-h">{{ tokenData.lastPayoutType }}</p>
    </div>
    <div class="performance__divider" />
    <div class="performance__apy-data">
      <p class="insurance__token-data-title">Daily APY</p>
      <div class="performance__apy-data-chain">
        <p class="performance__token-data-num performance__token-data-num--apy-num">{{ tokenData.dailyApy }}%</p>
        <div
          class="performance__icon-chain"
        >
          <BaseIcon
            :name=chainIcon
          />
        </div>

      </div>
    </div>
    <div class="performance__divider" />
    <div class="performance__tvl-data">
      <p class="insurance__token-data-title">{{ tokenData.tokenName }} TVL</p>
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
        :name="getIconName(chain)"
        class="performance__icon-chain-bottom"
      />
      <p class="performance__chain-data-name">{{ chain }}</p>
    </div>
  </div>

</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';

export default {
  name: 'TokenDataInsurance',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  props: {
    tokenData: {
      type: Object,
      default: () => ({
        insuranceImage: 'Insurance_Optimism',
        lastPayoutTime: '05:02',
        lastPayoutType: 'hours ago',
        dailyApy: '5',
      }),
    },
    chainIcon: {
      type: String,
      default: 'IconArbitrum',
    },
    chainName: {
      type: String,
      default: 'Optimism',
    },
  },
  computed: {
    networkName() {
      return this.$store.state.network.networkName;
    },
    networkScan() {
      return this.$store.state.network.explorerUrl;
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
      this.$store.dispatch('network/changeDappNetwork', chain.toLowerCase());
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
      const selectedChain = this.$store.state.network.networkName;
      const formattedChain = chain.charAt(0).toUpperCase() + chain.slice(1).toLowerCase();

      if (chain.toLowerCase() !== selectedChain.toLowerCase()) {
        return `Icon${formattedChain}Off`;
      }

      return `Icon${formattedChain}On`;
    },
  },
};
</script>

<style lang="scss" scoped>

.insurance__info {
  display:flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 18px;
}
.insurance__token-image {
  width: 76px;
}

.insurance__links-info {
  margin-top: 10px;
}

.insurance__title-token-info {
  display: flex;
  flex-direction: column;
}

.insurance__title-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  svg {
    margin-right: 8px;
  }
}

.insurance__redeem-button {
  margin-left: 8px;
}

.insurance__interact-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px;
  gap: 10px;
}

.insurance__title-button {
  background-color: var(--color-5);
  color: var(--color-1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  border: none;
  border-radius: 30px;
  padding: 5px 14px;
}

.performance__token-data {
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  background: var(--color-4);
  width: 100%;
  [data-theme="dark"] & {
    background: var(--color-6);
  }
}

.performance__icon-token {
  width: 90px;
  height: 90px;
}
.insurance__token-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
  margin-left: 10px;
}
.insurance__token-data-title {
  text-align: left;
  color: var(--color-2);
  font-size: 15px;
  font-weight: 500;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.insurance__token-data-title--token {
  color: var(--color-1);
  font-size: 20px;
  font-weight: 600;
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}
.insurance__token-data-link-addr {
  margin-right: 10px;
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
  border: 1px solid var(--color-6);
  background: var(--color-5);
  padding: 5px 10px;
  margin-top: 24px;
  width: fit-content;
  transition: background 0.3s ease, border 0.3s ease;
}
.selected {
  background: var(--color-4);
  [data-theme="dark"] & {
    background: var(--color-2);
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
    background: var(--color-7);
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
  flex-shrink: 0
}

.performance__chain-data-container {
  display: flex;
  flex-direction: row;
}

.performance__chain-data-container > *:not(:last-child) {
  margin-right: 7px;
}

@media (max-width: 1024px) {
  .performance__chain-data {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 30px;
    border: 1px solid var(--color-6);
    background: var(--color-5);
    padding: 2px 5px;
    margin-top: 24px;
  }
  .insurance__token-image {
    scale: 65%;
  }
  .performance__token-data-col-token {
    margin-left: 2px;
  }
  .performance__token-data__description {
    margin-left: 5px;
    max-width: 150px;
  }
  .insurance__token-title {
    margin-left: 5px;
  }

  .insurance__token-data-title {
      font-size: 16px;
  }
  .performance__token-data-num {
    font-size: 14px;
  }
  .performance__token-data-h {
    font-size: 12px;
  }
  .performance__divider {
    margin-left: 5px;
    margin-right: 5px;
  }
}

@media (max-width: 768px) {
  .performance__divider {
    margin-left: 20px;
    margin-right: 20px;
  }
  .performance__token-data-col-token {
    margin: 0;
  }
  .insurance__token-data-link-addr {
    margin-top: 40px;
  }
  .performance__token-data-num--payout-ago {
    margin-right: 15px;
  }
  .performance__chain-data {
    padding: 2px 5px;
    margin-top: 20px;
  }

  .performance__chain-data-name {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .performance__token-data-num {
    margin-top: 60px;
  }
  .performance__apy-data-chain {
    margin: 0;
  }
  .performance__icon-chain {
    margin-top: 60px;
  }
  .performance__divider {
    margin-left: 5px;
    margin-right: 5px;
  }
}
</style>

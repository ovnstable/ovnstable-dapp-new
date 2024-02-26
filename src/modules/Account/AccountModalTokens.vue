<template>
  <div class="dashboard__tokens-data-select">
    <div
      v-for="(token, index) in availableTokens"
      :key="index"
      class="dashboard__tokens-data-icon-wrapper"
      @click="addTokenToWallet(token.name)"
      @keypress="addTokenToWallet(token.name)"
    >
      <BaseIcon :name="token.iconName" />
      <p>{{token.name}}</p>
      <p>{{ token.contractAddress }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { appNetworksData } from '@/utils/const.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { chainContractsMap } from '@/utils/contractsMap.ts';

export default {
  name: 'AccountModalTokens',
  components: {
    BaseIcon,
  },
  data() {
    return {
      tokenDisplayInfo: {
        usdPlus: { name: 'USD+', iconName: 'USD+_market' },
        wUsdPlus: { name: 'wUsdPlus+', iconName: 'USD+_market' },
        ovn: { name: 'ovn+', iconName: 'USD+_market' },
        daiPlus: { name: 'DAI+', iconName: 'DAI+_market' },
        usdtPlus: { name: 'USDT+', iconName: 'USDT_market' },
        ethPlus: { name: 'ETH+', iconName: 'DashboardETH+Tokens' },
        wEthPlus: { name: 'wETH+', iconName: 'DashboardETH+Tokens' }, // TODO change icon
      },
      networksData: appNetworksData,
    };
  },
  computed: {
    networkName() {
      return this.$store.state.network.accountModalNetwork;
    },
    availableTokens(): any {
      const currentChainTokens = chainContractsMap[this
        .networkName.toLowerCase() as keyof typeof chainContractsMap];

      if (!currentChainTokens) {
        return [];
      }

      return Object.keys(currentChainTokens)
        .filter((token) => token.endsWith('Plus') || token === 'ovn')
        .flatMap((token) => {
          const baseTokenInfo = this.tokenDisplayInfo[token as keyof typeof this.tokenDisplayInfo];

          if (currentChainTokens[token].tokenPlus) {
            const baseTokenObject = {
              ...baseTokenInfo,
              contractAddress: currentChainTokens[token].tokenPlus,
            };

            const additionalTokens = Object.keys(currentChainTokens[token])
              .filter((key) => key.startsWith('w') && token.endsWith('Plus'))
              .map((key) => ({
                ...this.tokenDisplayInfo[key as keyof typeof this.tokenDisplayInfo],
                contractAddress: currentChainTokens[token][key],
              }));

            return [baseTokenObject, ...additionalTokens].filter(Boolean);
          }

          if (token === 'ovn') {
            return [{
              ...baseTokenInfo,
              contractAddress: currentChainTokens.ovn,
            }];
          }
          return [];
        })
        .filter((token) => token && token.name);
    },
    availableChains() {
      const availableNetworks = Object.entries(chainContractsMap)
        .reduce((acc: string[], [network, contracts]: [string, any]) => {
          if (contracts.usdPlus) {
            acc.push(network.charAt(0).toUpperCase() + network.slice(1));
          }
          return acc;
        }, []);

      return availableNetworks;
    },
  },

  methods: {
    addTokenToWallet(tokenName: any) {
      console.log('here is the token name', tokenName);
    },
    saveNetworkToLocalStore(chain:string) {
      this.$store.dispatch('network/changeAccountModalNetwork', chain.toLowerCase());
    },
    getIconName(chain:string) {
      const selectedChain = this.$store.state.network.accountModalNetwork;
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

.account-modal-chains__chain-data-container {
  max-width: 178px;
  max-height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

.account-modal-chains__icon:hover {
  opacity: 0.5;
  cursor: pointer;
}
</style>

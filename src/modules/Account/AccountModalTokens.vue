<template>
  <div class="account__modal-token-add">
    <div
      v-for="(token, index) in availableTokens"
      :key="index"
      class="account__modal-token-wrapper"
      @click="addTokenToWallet(token.name)"
      @keypress="addTokenToWallet(token.name)"
    >
      <BaseIcon :name="token.iconName" />
      <p>{{token.name}}</p>
    </div>
  </div>
</template>


<script lang="ts">
import { appNetworksData } from '@/utils/const.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { mapActions } from 'vuex';
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
        usdcPlus: { name: 'USDC+', iconName: 'USD+_market' }, // TODO change icon
        wUsdPlus: { name: 'WUSD+', iconName: 'USD+_market' }, // TODO change icon
        ovn: { name: 'OVN', iconName: 'USD+_market' },
        daiPlus: { name: 'DAI+', iconName: 'DAI+_market' },
        usdtPlus: { name: 'USDT+', iconName: 'USDT_market' },
        ethPlus: { name: 'ETH+', iconName: 'DashboardETH+Tokens' },
        wEthPlus: { name: 'WETH+', iconName: 'DashboardETH+Tokens' }, // TODO change icon
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

          if ((currentChainTokens as any)[token].tokenPlus) {
            const baseTokenObject = {
              ...baseTokenInfo,
              contractAddress: (currentChainTokens as any)[token].tokenPlus,
            };

            const additionalTokens = Object.keys((currentChainTokens as any)[token])
              .filter((key) => key.startsWith('w') && token.endsWith('Plus') && (currentChainTokens as any)[token][key] !== '')
              .map((key) => ({
                ...this.tokenDisplayInfo[key as keyof typeof this.tokenDisplayInfo],
                contractAddress: (currentChainTokens as any)[token][key],
              }));
            return [baseTokenObject, ...additionalTokens].filter(Boolean);
          }

          if (token === 'ovn') {
            return [{
              ...baseTokenInfo,
              contractAddress: (currentChainTokens as any).ovn,
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
    ...mapActions('network', ['addTokenToWallet']),
    async addTokenToWallet(tokenName: any) {
      console.log('add token to wallet method called');
      this.addTokenToWallet(tokenName.toLowerCase());
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

.account__modal-token-add {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.account__modal-token-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: var(--color-8);
  border: 1px solid var(--color-6);
  border-radius: 30px;
  padding: 5px;
  p {
    margin-left: 6px;
    color: var(--color-1);
    font-size: 14px;
    font-weight: 500;
  }
  svg {
    width: 23px;
    height: 23px;
    border-radius: 50%;
  }
}

.account__modal-token-wrapper:hover {
  cursor: pointer;
  opacity: 0.7;
}
</style>

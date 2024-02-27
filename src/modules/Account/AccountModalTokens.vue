<template>
  <div class="account__modal-token-add">
    <div
      v-for="(token, index) in availableTokens"
      :key="index"
      class="account__modal-token-wrapper"
      @click="addTokenToWalletMethod(token.contractAddress, token.name, token.decimals, token.image)"
      @keypress="addTokenToWalletMethod(token.contractAddress, token.name, token.decimals, token.image)"
    >
      <BaseIcon :name="token.iconName" />
      <p>{{token.name}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { appNetworksData } from '@/utils/const.ts';
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import { mapActions, mapGetters } from 'vuex';
import { chainContractsMap } from '@/utils/contractsMap.ts';
import UsdPlusImage from '@/assets/icons/account/usdPlus.json';
import DaiPlusImage from '@/assets/icons/account/daiPlus.json';
import UsdtPlusImage from '@/assets/icons/account/usdtPlus.json';
import EthPlusImage from '@/assets/icons/account/ethPlus.json';
import wEthPlus from '@/assets/icons/account/wEthPlus.json';
import WrappedUsdPlusImage from '@/assets/icons/account/wUsdPlus.json';
import UsdcPlus from '@/assets/icons/account/UsdcPlus.json';
import OvnImage from '@/assets/icons/account/ovn.json';

export default {
  name: 'AccountModalTokens',
  components: {
    BaseIcon,
  },
  data() {
    return {
      tokenDisplayInfo: {
        usdPlus: {
          name: 'USD+', iconName: 'USD+_market', image: UsdPlusImage.image, decimals: 6,
        },
        usdcPlus: {
          name: 'USDC+', iconName: 'USDC+_Account', image: UsdcPlus.image, decimals: 6,
        },
        wUsdPlus: {
          name: 'WUSD+', iconName: 'wUsdPlus', image: WrappedUsdPlusImage.image, decimals: 6,
        },
        ovn: {
          name: 'OVN', iconName: 'OVN_Account', image: OvnImage.image, decimals: 18,
        },
        daiPlus: {
          name: 'DAI+', iconName: 'DAI+_market', image: DaiPlusImage.image, decimals: 6,
        },
        usdtPlus: {
          name: 'USDT+', iconName: 'USDT_market', image: UsdtPlusImage.image, decimals: 6,
        },
        ethPlus: {
          name: 'ETH+', iconName: 'DashboardETH+Tokens', image: EthPlusImage.image, decimals: 18,
        },
        wEthPlus: {
          name: 'WETH+', iconName: 'wETH+_Account', image: wEthPlus.image, decimals: 18,
        },
      },
      networksData: appNetworksData,
    };
  },
  computed: {
    ...mapGetters('network', ['networkName']),
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
  },

  methods: {
    ...mapActions('network', ['addTokenToWallet']),
    addTokenToWalletMethod(address: any, symbol: any, decimals: any, image: any) {
      this.addTokenToWallet({
        address, symbol, decimals, image,
      });
    },

  },
};
</script>

<style lang="scss" scoped>

.account__modal-token-add {
  display: flex;
  flex-direction: row;
  gap: 24px;
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

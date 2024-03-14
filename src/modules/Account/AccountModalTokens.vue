<template>
  <div class="account__modal-token-add">
    <div
      v-for="(token, index) in availableTokens"
      :key="index"
      class="account__modal-token-wrapper"

      @click="addTokenToWalletMethod(token.contractAddress,
                                     token.name, token.decimals, token.image)"
      @keypress="addTokenToWalletMethod(token.contractAddress,
                                        token.name, token.decimals, token.image)"
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
          name: 'USD+', iconName: 'USD+_market', image: UsdPlusImage.image,
        },
        usdcPlus: {
          name: 'USDC+', iconName: 'USDC+_Account', image: UsdcPlus.image,
        },
        wUsdPlus: {
          name: 'WUSD+', iconName: 'wUsdPlus', image: WrappedUsdPlusImage.image,
        },
        ovn: {
          name: 'OVN', iconName: 'OVN_Account', image: OvnImage.image,
        },
        daiPlus: {
          name: 'DAI+', iconName: 'DAI+_market', image: DaiPlusImage.image,
        },
        usdtPlus: {
          name: 'USDT+', iconName: 'USDT_market', image: UsdtPlusImage.image,
        },
        ethPlus: {
          name: 'ETH+', iconName: 'DashboardETH+Tokens', image: EthPlusImage.image,
        },
        wEthPlus: {
          name: 'WETH+', iconName: 'wETH+_Account', image: wEthPlus.image,
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
          const chainTokenInfo = (currentChainTokens as any)[token];
          const baseTokenInfo = this.tokenDisplayInfo[token as keyof typeof this.tokenDisplayInfo];

          if (chainTokenInfo.tokenPlus) {
            const baseTokenObject = {
              ...baseTokenInfo,
              contractAddress: chainTokenInfo.tokenPlus,
              decimals: chainTokenInfo.decimals,
            };

            const additionalTokens = Object.keys(chainTokenInfo)
              .filter((key) => key.startsWith('w') && token.endsWith('Plus') && chainTokenInfo[key] !== '')
              .map((key) => ({
                ...this.tokenDisplayInfo[key as keyof typeof this.tokenDisplayInfo],
                contractAddress: chainTokenInfo[key],
                decimals: chainTokenInfo.decimals,
              }));
            return [baseTokenObject, ...additionalTokens].filter(Boolean);
          }

          if (token === 'ovn') {
            return [{
              ...baseTokenInfo,
              contractAddress: chainTokenInfo,
              decimals: 18,
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
  [data-theme="dark"] & {
    background-color: var(--color-17);
    color: var(--color-4);
  }
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

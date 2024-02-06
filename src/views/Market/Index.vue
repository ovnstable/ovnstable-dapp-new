<template>
  <MarketPage
    :token-data="tokenData"
    :portfolio-data="portfolioData"
    :collateral-data="collateralData"
    :payout-data="payoutData"
  />
</template>

<script lang="ts">

import {
  defineComponent, watch, computed, ref,
} from 'vue';

import MarketPage from '@/modules/Market/Index.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { contractAddressMap } from '@/utils/const.ts';

export default defineComponent({
  name: 'MarketView',
  components: {
    MarketPage,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const tokenData = computed(() => store.state.tokenData.tokenData || {});
    const portfolioData = computed(() => store.state.portfolioData.portfolioData || {});
    const collateralData = computed(() => store.state.collateralData.collateralData || {});
    const payoutData = computed(() => store.state.payoutData.payoutData || {});
    const previousId = ref('');
    const previousNetworkName = ref('');

    const saveNetworkToLocalStore = (chain: string) => {
      store.dispatch('network/changeDappNetwork', chain.toLowerCase());
    };

    watch(
      () => route.params.id,
      async (newId) => {
        const marketId = Array.isArray(newId) ? newId[0] : newId;
        if (marketId !== previousId.value) {
          console.log(`this is market id ${marketId}`);

          const normalizedMarketId = `${marketId.toUpperCase()}_PLUS`;
          console.log(contractAddressMap[normalizedMarketId]);
          console.log(store.state.network.networkName.toUpperCase());

          const currentNetworkName = store.state.network.networkName.toUpperCase();
          const availableChains = Object.keys(contractAddressMap[normalizedMarketId] || {});
          const fetchDataForMarketId = async (marketId:string, networkName:string) => {
            await Promise.all([
              store.dispatch('tokenData/fetchTokenData', { marketId, networkName }),
              store.dispatch('portfolioData/fetchPortfolioData', { marketId, networkName }),
              store.dispatch('collateralData/fetchCollateralData', { marketId, networkName }),
              store.dispatch('payoutData/fetchPayoutData', { marketId, networkName }),
            ]);
          };

          if (!availableChains.includes(currentNetworkName)) {
            const firstAvailableChain = availableChains.length > 0 ? availableChains[0] : null;
            if (firstAvailableChain) {
              console.log(`Switching network to the first available chain: ${firstAvailableChain}`);
              saveNetworkToLocalStore(firstAvailableChain.toLowerCase());
              await fetchDataForMarketId(marketId, store.state.network.networkName);
            } else {
              console.error('No available chains found for this market ID.');
            }
          } else {
            await fetchDataForMarketId(marketId, store.state.network.networkName);
          }

          previousId.value = marketId;
        }
      },
      { immediate: true },
    );


    watch(
      () => store.state.network.networkName,
      async (newNetworkName, oldNetworkName) => {
        if (newNetworkName !== oldNetworkName) {
          const marketId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
          try {
            if (newNetworkName !== previousNetworkName.value) {
              await Promise.all([
                store.dispatch('portfolioData/fetchPortfolioData', { marketId, networkName: newNetworkName }),
                store.dispatch('collateralData/fetchCollateralData', { marketId, networkName: newNetworkName }),
                store.dispatch('payoutData/fetchPayoutData', { marketId, networkName: newNetworkName }),
              ]);
              previousNetworkName.value = newNetworkName;
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      },
      { immediate: true },
    );

    if (!route.params.id) {
      router.push({ name: 'market', params: { id: 'usd' } });
    }

    return {
      tokenData,
      portfolioData,
      collateralData,
      payoutData,
    };
  },
});
</script>

<style>
.modal-content {
  padding: 50px 70px 30px 70px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--color-1);
    margin-bottom: 20px;
    text-align: center;
  }
}

.modal-content__spin {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.modal-content__confirm {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-2);
  margin-bottom: 40px;
  text-align: center;
}

.divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-7);
}

.modal-content__tips {
  margin-top: 40px;
}

</style>

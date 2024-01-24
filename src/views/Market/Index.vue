<template>
  <MarketPage
    :token-data="tokenData"
    :portfolio-data="portfolioData"
    :collateral-data="collateralData"
  />
</template>

<script lang="ts">
import { defineComponent, watch, computed } from 'vue';
import MarketPage from '@/modules/Market/Index.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

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
    watch(
      () => route.params.id,
      async (newId) => {
        const marketId = Array.isArray(newId) ? newId[0] : newId;
        const { networkName } = store.state.network;
        if (typeof marketId === 'string' && networkName) {
          console.log('from index.vue');
          console.log('marketId:', marketId, 'networkName:', networkName);
          await store.dispatch('tokenData/fetchTokenData', { marketId, networkName });
          await store.dispatch('portfolioData/fetchPortfolioData', { marketId, networkName });
          await store.dispatch('collateralData/fetchCollateralData', { marketId, networkName });
        }
      },
      { immediate: true },
    );

    if (!route.params.id) {
      router.push({ name: 'market', params: { id: 'default-market-id' } });
    }

    return {
      tokenData,
      portfolioData,
      collateralData,
    };
  },
});
</script>
